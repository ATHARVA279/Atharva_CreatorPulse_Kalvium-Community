const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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

export async function getDashboardSummary() {
  return apiFetch('/api/dashboard/summary');
}

export async function getCreatorRankings(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/api/creators${query}`);
}

export async function getCampaigns(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/api/campaigns${query}`);
}

export async function getReferralSources(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/api/referral-sources${query}`);
}

export async function getRevenue(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/api/revenue${query}`);
}
