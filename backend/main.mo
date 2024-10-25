import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";

actor {
    // Type definition for TaxPayer
    public type TaxPayer = {
        tid: Text;
        firstName: Text;
        lastName: Text;
        address: Text;
    };

    // Stable variable to persist data across upgrades
    private stable var taxpayersEntries : [(Text, TaxPayer)] = [];
    
    // HashMap to store TaxPayer records
    private var taxpayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

    // System functions for upgrade persistence
    system func preupgrade() {
        taxpayersEntries := Iter.toArray(taxpayers.entries());
    };

    system func postupgrade() {
        taxpayers := HashMap.fromIter<Text, TaxPayer>(taxpayersEntries.vals(), 1, Text.equal, Text.hash);
    };

    // Add new taxpayer record
    public func addTaxPayer(tp: TaxPayer) : async Bool {
        taxpayers.put(tp.tid, tp);
        return true;
    };

    // Get taxpayer by TID
    public query func getTaxPayer(tid: Text) : async ?TaxPayer {
        taxpayers.get(tid)
    };

    // Get all taxpayers
    public query func getAllTaxPayers() : async [TaxPayer] {
        Iter.toArray(taxpayers.vals())
    };
}
