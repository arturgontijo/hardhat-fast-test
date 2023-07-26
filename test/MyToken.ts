import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MyToken } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('MyToken', function () {

    let alith: SignerWithAddress, baltathar: SignerWithAddress;
    let token: MyToken;
    const TOTAL_SUPPLY = '8000000000000000000000000';

    beforeEach(async () => {
        [alith, baltathar] = await ethers.getSigners();

        const tokenFactory = await ethers.getContractFactory('MyToken', alith);
        token = await tokenFactory.deploy(TOTAL_SUPPLY);
        await token.deployed();
    });

    describe('Deployment', function () {
        // Check Total Supply
        it('checks total supply', async () => {
            const totalSupply = await token.totalSupply();
            expect(totalSupply).to.equal(TOTAL_SUPPLY);
        });
        // Check the balance of the owner of the contract
        it('should return the balance of token owner', async () => {
            const balance = await token.balanceOf(alith.address);
            expect(balance).to.equal(TOTAL_SUPPLY);
        });
        // Transfer token and check balances
        it('should transfer token', async () => {
            const amount = '1000000000000000000';
            // Transfer method
            const tx = await token.transfer(baltathar.address, amount);
            await tx.wait();
            const balanceOther = await token.balanceOf(baltathar.address);
            expect(balanceOther).to.equal(amount);
        });
        // Revert
        it('should revert transfer to zero address', async () => {
            let zero_address = '0x0000000000000000000000000000000000000000';
            let expected_revert_reason = 'ERC20: transfer to the zero address';

            // Now we try again but wrapping it in expectRevert which gives an informative message.
            await expect(token.transfer(zero_address, 10)).revertedWith(expected_revert_reason);
        })
    });
});
