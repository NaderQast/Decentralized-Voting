// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystem} from "../src/VotingSystem.sol";

contract CounterScript is Script {
    VotingSystem public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new VotingSystem();

        vm.stopBroadcast();
    }
}
