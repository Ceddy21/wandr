export const filterTrips = (trips, searchTerm, filterStatus) => {
  return trips.filter((trip) => {
    const matchesSearch = trip.destination
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
};

export const sortTrips = (trips, sortBy) => {
  const copy = [...trips];
  if (sortBy === 'date') {
    return copy.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }
  if (sortBy === 'destination') {
    return copy.sort((a, b) => a.destination?.localeCompare(b.destination) || 0);
  }
  if (sortBy === 'members') {
    return copy.sort((a, b) => (b.members || 0) - (a.members || 0));
  }
  return copy;
};

export const paginateTrips = (trips, page, pageSize) => {
  return trips.slice((page - 1) * pageSize, page * pageSize);
};

export const getTripStats = (trips) => {
  const total = trips.length;
  const upcoming = trips.filter((t) => t.status === 'upcoming').length;
  const ongoing = trips.filter((t) => t.status === 'ongoing').length;
  const completed = trips.filter((t) => t.status === 'completed').length;
  return { total, upcoming, ongoing, completed };
};

export const getNextTrip = (trips) => {
  return trips
    .filter((t) => t.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
};