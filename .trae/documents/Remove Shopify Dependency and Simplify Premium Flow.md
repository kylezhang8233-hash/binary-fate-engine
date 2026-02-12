## Plan: Remove Shopify Dependency and Simplify Premium Flow

### Objective
Modify the Binary Fate Engine to work independently without Shopify, while preserving premium functionality for future monetization.

### Key Changes

1. **Simplify Backend Shopify Integration**
   - Remove `shopify-api-node` dependency from `package.json`
   - Simplify `shopify.js` route to focus on manual upgrade functionality only
   - Keep the `/api/shopify/upgrade` endpoint for manual user upgrades
   - Remove all Shopify API calls and checkout creation logic
   - Update backend logging to remove Shopify-specific messages

2. **Update Frontend Upgrade Flow**
   - Modify `App.jsx` to replace Shopify checkout with direct premium upgrade
   - Add a simple confirmation dialog for premium upgrade
   - Update the upgrade button to call the manual upgrade endpoint
   - Remove Shopify-specific checkout state and logic

3. **Simplify Environment Configuration**
   - Remove Shopify-related environment variables from `.env`
   - Update documentation to reflect simplified setup

4. **Update Tests**
   - Modify `test_complete_flow.js` to remove Shopify checkout tests
   - Add tests for manual premium upgrade functionality
   - Ensure all existing tests still pass

### Expected Outcome
- The Binary Fate Engine will work independently without Shopify
- Users can register and use the free tier normally
- Admins can manually upgrade users to premium via the `/api/shopify/upgrade` endpoint
- The codebase remains flexible for future monetization integration
- All core Bazi analysis functionality is preserved

### Benefits
- Simplified development and deployment process
- No dependency on Shopify during initial development
- Faster iteration on core features
- Flexibility to choose monetization strategy later
- Lower barrier to entry for initial testing and feedback