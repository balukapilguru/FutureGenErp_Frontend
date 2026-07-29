import Referrals from "../../componentLayer/pages/referrals/Referrals"
import { ReferralsAction } from "../../componentLayer/pages/referrals/Referrals.action"
import { ReferralsLoader } from "../../componentLayer/pages/referrals/Referrals.loader"

const ReferralsRoutes = [
    {
        index:true,
        element:<Referrals />,
        loader: ReferralsLoader,
        action: ReferralsAction
    }
]
export default ReferralsRoutes