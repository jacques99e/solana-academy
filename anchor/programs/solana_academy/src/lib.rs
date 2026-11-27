use anchor_lang::prelude::*;

declare_id!("9jvjBfgykeWZz7UM8xyJQeVP6jNWDsXaWXL2maeAF4Bw");

#[program]
pub mod solana_academy {
    use super::*;

    pub fn enregistrer_diplome(ctx: Context<EnregistrerDiplome>) -> Result<()> {
        let diplome = &mut ctx.accounts.diplome;
        diplome.utilisateur = ctx.accounts.utilisateur.key();
        diplome.niveau_1_valide = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct EnregistrerDiplome<'info> {
    #[account(mut)]
    pub utilisateur: Signer<'info>,
    #[account(
        init_if_needed,
        payer = utilisateur,
        space = 8 + Diplome::INIT_SPACE,
        seeds = [b"diplome", utilisateur.key().as_ref()],
        bump
    )]
    pub diplome: Account<'info, Diplome>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Diplome {
    pub utilisateur: Pubkey,
    pub niveau_1_valide: bool,
}
