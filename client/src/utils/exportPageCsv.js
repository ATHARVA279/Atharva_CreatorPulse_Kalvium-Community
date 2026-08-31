import {
  getCampaigns,
  getCreatorRankings,
  getDashboardSummary,
  getReferralSources,
  getRevenue,
} from "../services/api";
import { downloadCsv, rowsToCsv } from "./csv";

const CREATOR_COLUMNS = [
  { label: "creator_id", key: "creator_id" },
  { label: "creator_name", key: "creator_name" },
  { label: "campaign_count", key: "campaign_count" },
  { label: "total_impressions", key: "total_impressions" },
  { label: "total_engagements", key: "total_engagements" },
  { label: "total_clicks", key: "total_clicks" },
  { label: "engagement_rate", key: "engagement_rate" },
  { label: "ctr", key: "ctr" },
  { label: "conversion_rate", key: "conversion_rate" },
  { label: "total_purchases", key: "total_purchases" },
  { label: "revenue", key: "revenue" },
];

const CAMPAIGN_COLUMNS = [
  { label: "campaign_id", key: "campaign_id" },
  { label: "creator_id", key: "creator_id" },
  { label: "creator_name", key: "creator_name" },
  { label: "campaign_date", key: "campaign_date" },
  { label: "impressions", key: "impressions" },
  { label: "engagements", key: "engagements" },
  { label: "engagement_rate", key: "engagement_rate" },
  { label: "clicks", key: "clicks" },
  { label: "ctr", key: "ctr" },
  { label: "conversion_rate", key: "conversion_rate" },
  { label: "purchases", key: "purchases" },
  { label: "revenue", key: "revenue" },
];

const REFERRAL_COLUMNS = [
  { label: "source", value: (row) => row.source_name || row.traffic_source },
  { label: "clicks", key: "clicks" },
  { label: "impressions", key: "impressions" },
  { label: "engagements", key: "engagements" },
  { label: "purchases", key: "purchases" },
  { label: "conversion_rate", key: "conversion_rate" },
  { label: "revenue", key: "revenue" },
];

const REVENUE_COLUMNS = [
  { label: "creator_id", key: "creator_id" },
  { label: "creator_name", value: (row) => row.name || row.creator_name },
  { label: "clicks", key: "clicks" },
  { label: "purchases", key: "purchases" },
  { label: "revenue", key: "revenue" },
];

const SUMMARY_COLUMNS = [
  { label: "metric", key: "metric" },
  { label: "value", key: "value" },
];

function fileStamp() {
  return new Date().toISOString().slice(0, 10);
}

function summaryRows(summary) {
  return [
    { metric: "total_creators", value: summary.total_creators },
    { metric: "total_campaigns", value: summary.total_campaigns },
    { metric: "total_impressions", value: summary.total_impressions },
    { metric: "total_engagements", value: summary.total_engagements },
    { metric: "total_referral_clicks", value: summary.total_referral_clicks },
    { metric: "total_purchases", value: summary.total_purchases },
    { metric: "overall_conversion_rate", value: summary.overall_conversion_rate },
    { metric: "total_attributed_revenue", value: summary.total_attributed_revenue },
  ];
}

export async function exportPageCsv(pathname, filters = {}) {
  let rows = [];
  let columns = [];
  let slug = "export";

  switch (pathname) {
    case "/campaigns": {
      rows = await getCampaigns(filters);
      columns = CAMPAIGN_COLUMNS;
      slug = "campaigns";
      break;
    }
    case "/creators": {
      rows = await getCreatorRankings(filters);
      columns = CREATOR_COLUMNS;
      slug = "creators";
      break;
    }
    case "/referrals": {
      rows = await getReferralSources(filters);
      columns = REFERRAL_COLUMNS;
      slug = "referrals";
      break;
    }
    case "/revenue": {
      rows = await getRevenue(filters);
      columns = REVENUE_COLUMNS;
      slug = "revenue";
      break;
    }
    case "/overview":
    default: {
      const [summary, creators] = await Promise.all([
        getDashboardSummary(filters),
        getCreatorRankings(filters),
      ]);
      const summaryCsv = rowsToCsv(summaryRows(summary || {}), SUMMARY_COLUMNS);
      const creatorsCsv = rowsToCsv(creators || [], CREATOR_COLUMNS);
      downloadCsv(`creatorpulse-overview-${fileStamp()}.csv`, `${summaryCsv}\n\n${creatorsCsv}`);
      return;
    }
  }

  downloadCsv(`creatorpulse-${slug}-${fileStamp()}.csv`, rowsToCsv(rows || [], columns));
}
