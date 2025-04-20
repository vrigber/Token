//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./ERC20.sol";
import "./Mintable.sol";

contract Token is ERC20, Mintable {
  string public constant name = "MyToken";
  string public constant symbol = "ING";
  uint8 public constant decimals = 10;

  constructor(uint256 amount)
  {
      _mint(msg.sender, amount);
  }
}
