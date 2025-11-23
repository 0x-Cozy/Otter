module otter_contract_examples::allowlist;

use std::string::String;
use sui::{
    coin::{Self as coin, Coin},
    dynamic_field as df,
    object,
    sui::SUI,
    table::{Self, Table},
    tx_context::TxContext,
};
use otter_contract_examples::utils;

const EInvalidCap: u64 = 0;
const ENoAccess: u64 = 1;
const EInvalidFee: u64 = 2;
const MARKER: u64 = 3;

public struct Allowlist has key {
    id: object::UID,
    name: String,
    fee: u64,
    owner: address,
    members: Table<address, bool>,
}

public struct Cap has key {
    id: object::UID,
    allowlist_id: object::ID,
}

public fun create_allowlist(name: String, fee: u64, ctx: &mut TxContext): Cap {
    let allowlist = Allowlist {
        id: object::new(ctx),
        name,
        fee,
        owner: ctx.sender(),
        members: table::new(ctx),
    };
    let cap = Cap {
        id: object::new(ctx),
        allowlist_id: object::id(&allowlist),
    };
    transfer::share_object(allowlist);
    cap
}

entry fun create_allowlist_entry(name: String, fee: u64, ctx: &mut TxContext) {
    let cap = create_allowlist(name, fee, ctx);
    // sharing the Cap here is for demonstration  so thart we can test without the need to create a new allowlist. in prod you keep for access control
    transfer::share_object(cap);
}

entry fun join_allowlist(
    allowlist: &mut Allowlist,
    mut payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let fee = allowlist.fee;
    let payment_value = coin::value(&payment);
    assert!(payment_value >= fee, EInvalidFee);
    
    let sender = ctx.sender();
    
    if (payment_value > fee) {
        let refund = payment_value - fee;
        let refund_coin = coin::split(&mut payment, refund, ctx);
        sui::transfer::public_transfer(refund_coin, sender);
        sui::transfer::public_transfer(payment, allowlist.owner);
    } else {
        sui::transfer::public_transfer(payment, allowlist.owner);
    };
    
    if (!table::contains(&allowlist.members, sender)) {
        table::add(&mut allowlist.members, sender, true);
    };
}

public fun namespace(allowlist: &Allowlist): vector<u8> {
    object::id(allowlist).to_bytes()
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

fun approve_internal(caller: address, id: vector<u8>, allowlist: &Allowlist): bool {
    let namespace = namespace(allowlist);
    if (!utils::is_prefix(namespace, id)) {
        return false
    };
    
    let chunk_index = extract_chunk_index(id);
    if (chunk_index == 0) {
        return false
    };
    
    if (chunk_index != 1) {
        return false
    };
    
    table::contains(&allowlist.members, caller) && *table::borrow(&allowlist.members, caller)
}

entry fun seal_approve(id: vector<u8>, allowlist: &Allowlist, ctx: &TxContext) {
    assert!(approve_internal(ctx.sender(), id, allowlist), ENoAccess);
}

public fun publish(allowlist: &mut Allowlist, cap: &Cap, blob_id: String, ctx: &mut TxContext) {
    assert!(cap.allowlist_id == object::id(allowlist), EInvalidCap);
    df::add(&mut allowlist.id, blob_id, MARKER);
}

