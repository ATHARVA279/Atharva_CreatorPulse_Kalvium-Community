const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json();
}

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getDashboardSummary(filters = {}) {
  return apiFetch(`/api/dashboard/summary${buildQueryString(filters)}`);
}

export async function getCreatorRankings(filters = {}) {
  return apiFetch(`/api/creators${buildQueryString(filters)}`);
}

export async function getCreatorDetail(creatorId, filters = {}) {
  return apiFetch(`/api/creators/${encodeURIComponent(creatorId)}${buildQueryString(filters)}`);
}

export async function getCampaigns(filters = {}) {
  return apiFetch(`/api/campaigns${buildQueryString(filters)}`);
}

export async function getReferralSources(filters = {}) {
  return apiFetch(`/api/referral-sources${buildQueryString(filters)}`);
}

export async function getRevenue(filters = {}) {
  return apiFetch(`/api/revenue${buildQueryString(filters)}`);
}

export async function getFunnel(filters = {}) {
  return apiFetch(`/api/funnel${buildQueryString(filters)}`);
}

export async function getPurchaseBehaviour(filters = {}) {
  return apiFetch(`/api/purchase-behaviour${buildQueryString(filters)}`);
}

export { API_BASE_URL };
