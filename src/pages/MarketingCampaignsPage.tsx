import React from 'react';
import { CampaignOverview } from '../components/Marketing/CampaignOverview';

const MarketingCampaignsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Campañas de Marketing</h2>
      <CampaignOverview />
    </div>
  );
};

export default MarketingCampaignsPage;