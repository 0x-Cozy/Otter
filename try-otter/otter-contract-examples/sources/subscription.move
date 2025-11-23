module otter_contract_examples::subscription;

use std::string::String;
use sui::{
    clock::Clock,
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

public struct Subscription has key {
    id: object::UID,
    name: String,
    fee: u64,
    duration_ms: u64,
    owner: address,
    subscriptions: Table<address, u64>,
}

public struct Cap has key {
    id: object::UID,
    subscription_id: object::ID,
}

public fun create_subscription(name: String, fee: u64, duration_ms: u64, ctx: &mut TxContext): Cap {
    let subscription = Subscription {
        id: object::new(ctx),
        name,
        fee,
        duration_ms,
        owner: ctx.sender(),
        subscriptions: table::new(ctx),
    };
    let cap = Cap {
        id: object::new(ctx),
        subscription_id: object::id(&subscription),
    };
    transfer::share_object(subscription);
    cap
}

entry fun create_subscription_entry(name: String, fee: u64, duration_ms: u64, ctx: &mut TxContext) {
    let cap = create_subscription(name, fee, duration_ms, ctx);
    /// sharing for demonstration
    transfer::share_object(cap);
}

entry fun subscribe(
    subscription: &mut Subscription,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let fee = subscription.fee;
    let payment_value = coin::value(&payment);
    assert!(payment_value >= fee, EInvalidFee);
    
    let sender = ctx.sender();
    let current_time = clock.timestamp_ms();
    let expiration = current_time + subscription.duration_ms;
    
    if (payment_value > fee) {
        let refund = payment_value - fee;
        let refund_coin = coin::split(&mut payment, refund, ctx);
        sui::transfer::public_transfer(refund_coin, sender);
        sui::transfer::public_transfer(payment, subscription.owner);
    } else {
        sui::transfer::public_transfer(payment, subscription.owner);
    };
    
    if (table::contains(&subscription.subscriptions, sender)) {
        let existing_expiration = *table::borrow(&subscription.subscriptions, sender);
        if (expiration > existing_expiration) {
            *table::borrow_mut(&mut subscription.subscriptions, sender) = expiration;
        };
    } else {
        table::add(&mut subscription.subscriptions, sender, expiration);
    };
}

public fun namespace(subscription: &Subscription): vector<u8> {
    object::id(subscription).to_bytes()
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

fun approve_internal(caller: address, id: vector<u8>, subscription: &Subscription, clock: &Clock): bool {
    let namespace = namespace(subscription);
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
    
    if (!table::contains(&subscription.subscriptions, caller)) {
        return false
    };
    
    let expiration = *table::borrow(&subscription.subscriptions, caller);
    clock.timestamp_ms() < expiration
}

entry fun seal_approve(id: vector<u8>, subscription: &Subscription, clock: &Clock, ctx: &TxContext) {
    assert!(approve_internal(ctx.sender(), id, subscription, clock), ENoAccess);
}

public fun publish(subscription: &mut Subscription, cap: &Cap, blob_id: String, ctx: &mut TxContext) {
    assert!(cap.subscription_id == object::id(subscription), EInvalidCap);
    df::add(&mut subscription.id, blob_id, MARKER);
}

