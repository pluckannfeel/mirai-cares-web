// import axios from 'axios';
import { useQuery } from 'react-query';
import { ActivityLog } from '../types/activityLog';

const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  // const { data } = await axios.get("/api/activity-logs");

  const data = [
    {
      id: '1',
      actor: 'You',
      code: 'eventAdded',
      createdAt: 1691540635000,
      params: {
        resource: 'React Summit',
      },
    },
    {
      id: '2',
      actor: 'John Smith',
      code: 'eventUpdated',
      createdAt: 1617868226000,
      params: {
        resource: 'React Summit',
      },
    },
    {
      id: '3',
      actor: 'John Smith',
      code: 'userDeleted',
      createdAt: 1617868226000,
      params: {
        resource: 'John Smith',
      },
    },
    {
      id: '4',
      actor: 'John Smith',
      code: 'userUpdated',
      createdAt: 1617868226000,
      params: {
        resource: 'John Smith',
      },
    },
    {
      id: '5',
      actor: 'John Smith',
      code: 'userAdded',
      createdAt: 1617868226000,
      params: {
        resource: 'John Smith',
      },
    },
  ];

  return data;
};

export function useActivityLogs() {
  return useQuery('activity-logs', () => fetchActivityLogs());
}
