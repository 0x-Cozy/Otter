module otter_contract_examples::utils;

/// Checks if `prefix` is a prefix of `data`
public fun is_prefix(prefix: vector<u8>, data: vector<u8>): bool {
    if (prefix.length() > data.length()) {
        return false
    };
    let mut i = 0;
    while (i < prefix.length()) {
        if (prefix[i] != data[i]) {
            return false
        };
        i = i + 1;
    };
    true
}

