// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWhiteList {
    function s_whiteListedAddress(address) external view returns (bool);
}
