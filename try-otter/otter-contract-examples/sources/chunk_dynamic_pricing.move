module otter_contract_examples::chunk_dynamic_pricing;

use std::string::String;
use sui::{
    coin::{Self as coin, Coin},
    dynamic_field as df,
    event,
    object,
    sui::SUI,
    table::{Self, Table},
    tx_context::TxContext,
};
use otter_contract_examples::utils;

const EInvalidCap: u64 = 0;
const ENoAccess: u64 = 1;
const EInvalidFee: u64 = 2;
const ETotalChunksNotSet: u64 = 3;
const MARKER: u64 = 4;
const TOTAL_FEE: u64 = 100000000;

public struct PaymentQuoteEvent has copy, drop, store {
    policy_id: object::ID,
    user: address,
    target_max_index: u64,
    current_max_index: u64,
    chunks_needed: u64,
    total_fee: u64,
    preview_only: bool,
}

public struct PaymentProcessedEvent has copy, drop, store {
    policy_id: object::ID,
    user: address,
    target_max_index: u64,
    chunks_granted: u64,
    charged_fee: u64,
    new_max_index: u64,
}

public struct ChunkDynamicPricing has key {
    id: object::UID,
    name: String,
    total_chunks: u64,
    owner: address,
    max_chunk_index: Table<address, u64>,
}

public struct Cap has key {
    id: object::UID,
    policy_id: object::ID,
}

public fun create_chunk_dynamic(name: String, total_chunks: u64, ctx: &mut TxContext): Cap {
    let policy = ChunkDynamicPricing {
        id: object::new(ctx),
        name,
        total_chunks: 0,
        owner: ctx.sender(),
        max_chunk_index: table::new(ctx),
    };
    let cap = Cap {
        id: object::new(ctx),
        policy_id: object::id(&policy),
    };
    transfer::share_object(policy);
    cap
}

entry fun create_chunk_dynamic_entry(name: String, ctx: &mut TxContext) {
    transfer::transfer(create_chunk_dynamic(name, 0, ctx), ctx.sender());
}

public fun set_total_chunks(policy: &mut ChunkDynamicPricing, cap: &Cap, total_chunks: u64, ctx: &mut TxContext) {
    assert!(cap.policy_id == object::id(policy), EInvalidCap);
    assert!(policy.total_chunks == 0, ETotalChunksNotSet);
    policy.total_chunks = total_chunks;
}

entry fun set_total_chunks_entry(
    policy: &mut ChunkDynamicPricing,
    cap: &Cap,
    total_chunks: u64,
    ctx: &mut TxContext,
) {
    set_total_chunks(policy, cap, total_chunks, ctx);
}

fun calculate_chunk_fee(policy: &ChunkDynamicPricing, chunk_index: u64): u64 {
    if (policy.total_chunks == 0) {
        return 0
    };
    
    let linear_weight = chunk_index;
    let total_weight = (policy.total_chunks * (policy.total_chunks + 1)) / 2;
    
    if (total_weight == 0) {
        return 0
    };
    
    (linear_weight * TOTAL_FEE) / total_weight
}

fun payment_details_for(policy: &ChunkDynamicPricing, user: address, target_max_index: u64): (u64, u64, u64) {
    assert!(policy.total_chunks > 0, ETotalChunksNotSet);
    
    let current_max = if (table::contains(&policy.max_chunk_index, user)) {
        *table::borrow(&policy.max_chunk_index, user)
    } else {
        0
    };
    
    let chunks_needed = if (target_max_index > current_max) {
        target_max_index - current_max
    } else {
        0
    };
    
    let mut expected_fee = 0;
    let mut i = current_max + 1;
    while (i <= target_max_index) {
        expected_fee = expected_fee + calculate_chunk_fee(policy, i);
        i = i + 1;
    };
    
    (current_max, chunks_needed, expected_fee)
}

entry fun add_chunks_preview(
    policy: &ChunkDynamicPricing,
    target_max_index: u64,
    ctx: &TxContext,
) {
    let policy_id = object::id(policy);
    let (current_max, chunks_needed, expected_fee) = payment_details_for(policy, ctx.sender(), target_max_index);
    
    event::emit(PaymentQuoteEvent {
        policy_id,
        user: ctx.sender(),
        target_max_index,
        current_max_index: current_max,
        chunks_needed,
        total_fee: expected_fee,
        preview_only: true,
    });
}

entry fun add_chunks(
    mut payment: Coin<SUI>,
    policy: &mut ChunkDynamicPricing,
    target_max_index: u64,
    ctx: &mut TxContext,
) {
    let policy_id = object::id(policy);
    let (current_max, chunks_needed, expected_fee) = payment_details_for(policy, ctx.sender(), target_max_index);
    
    event::emit(PaymentQuoteEvent {
        policy_id,
        user: ctx.sender(),
        target_max_index,
        current_max_index: current_max,
        chunks_needed,
        total_fee: expected_fee,
        preview_only: false,
    });
    
    if (chunks_needed == 0) {
        sui::transfer::public_transfer(payment, ctx.sender());
        return
    };
    
    let payment_value = coin::value(&payment);
    assert!(payment_value >= expected_fee, EInvalidFee);
    
    if (payment_value > expected_fee) {
        let refund = payment_value - expected_fee;
        let refund_coin = coin::split(&mut payment, refund, ctx);
        sui::transfer::public_transfer(refund_coin, ctx.sender());
        sui::transfer::public_transfer(payment, policy.owner);
    } else {
        sui::transfer::public_transfer(payment, policy.owner);
    };
    
    if (table::contains(&policy.max_chunk_index, ctx.sender())) {
        *table::borrow_mut(&mut policy.max_chunk_index, ctx.sender()) = target_max_index;
    } else {
        table::add(&mut policy.max_chunk_index, ctx.sender(), target_max_index);
    };
    
    event::emit(PaymentProcessedEvent {
        policy_id,
        user: ctx.sender(),
        target_max_index,
        chunks_granted: chunks_needed,
        charged_fee: expected_fee,
        new_max_index: target_max_index,
    });
}

public fun namespace(policy: &ChunkDynamicPricing): vector<u8> {
    object::id(policy).to_bytes()
}

fun extract_chunk_index(chunk_id: vector<u8>): u64 {
    let len = vector::length(&chunk_id);
    if (len < 2) {
        return 0
    };
    let idx_byte_0 = *vector::borrow(&chunk_id, len - 2);
    let idx_byte_1 = *vector::borrow(&chunk_id, len - 1);
    (idx_byte_0 as u64) | ((idx_byte_1 as u64) << 8)
}

fun approve_internal(caller: address, id: vector<u8>, policy: &ChunkDynamicPricing): bool {
    let namespace = namespace(policy);
    if (!utils::is_prefix(namespace, id)) {
        return false
    };
    
    let chunk_index = extract_chunk_index(id);
    if (chunk_index == 0) {
        return false
    };
    
    if (table::contains(&policy.max_chunk_index, caller)) {
        let max_index = *table::borrow(&policy.max_chunk_index, caller);
        return chunk_index <= max_index
    };
    
    false
}

entry fun seal_approve(id: vector<u8>, policy: &ChunkDynamicPricing, ctx: &TxContext) {
    assert!(approve_internal(ctx.sender(), id, policy), ENoAccess);
}

public fun publish(policy: &mut ChunkDynamicPricing, cap: &Cap, blob_id: String, ctx: &mut TxContext) {
    assert!(cap.policy_id == object::id(policy), EInvalidCap);
    df::add(&mut policy.id, blob_id, MARKER);
}

