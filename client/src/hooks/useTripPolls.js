import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '../services/tripService';
import { getSocket, joinTripRoom, leaveTripRoom } from '../services/socketService';

export const useTripPolls = (tripId) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
  });

  const fetchPolls = useCallback(async (silent = false) => {
    if (!tripId) return;
    if (!silent) setLoading(true);
    try {
      const data = await tripService.getPolls(tripId);
      setPolls(data);
    } catch (err) {
      console.error('Fetch polls error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useEffect(() => {
    if (!tripId) return;

    const socket = getSocket();
    joinTripRoom(tripId);

    const handlePollsChanged = () => {
      fetchPolls(true); 
    };

    socket.on('polls-changed', handlePollsChanged);

    return () => {
      socket.off('polls-changed', handlePollsChanged);
      leaveTripRoom(tripId);
    };
  }, [tripId, fetchPolls]);

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.some((o) => !o.trim())) {
      toast.error('Please fill in all fields');
      return { success: false };
    }

    const validOptions = newPoll.options.filter((o) => o.trim());

    try {
      const created = await tripService.addPoll(tripId, {
        question: newPoll.question,
        options: validOptions,
      });

      setPolls((prev) => {
        if (prev.some((p) => p._id === created._id)) return prev;
        return [created, ...prev];
      });
      setNewPoll({ question: '', options: ['', ''] });
      toast.success('Poll created!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to create poll');
      return { success: false };
    }
  };

  const deletePoll = async (pollId) => {
    try {
      await tripService.deletePoll(tripId, pollId);
      setPolls((prev) => prev.filter((p) => p._id !== pollId));
      toast.success('Poll deleted!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete poll');
      return { success: false };
    }
  };

  const addChoice = async (pollId, text) => {
    try {
      const updated = await tripService.addPollChoice(tripId, pollId, text);
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? updated : p))
      );
      toast.success('Choice added!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to add choice');
      return { success: false };
    }
  };

  const deleteChoice = async (pollId, choiceId) => {
    try {
      const updated = await tripService.deletePollChoice(tripId, pollId, choiceId);
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? updated : p))
      );
      toast.success('Choice removed!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete choice');
      return { success: false };
    }
  };

  const vote = async (pollId, optionText) => {
    try {
      const updated = await tripService.votePoll(tripId, pollId, optionText);
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? updated : p))
      );
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to vote');
      return { success: false };
    }
  };

  const addPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updatePollOption = (index, value) => {
    const copy = [...newPoll.options];
    copy[index] = value;
    setNewPoll({ ...newPoll, options: copy });
  };

  const removePollOption = (index) => {
    if (newPoll.options.length <= 2) {
      toast.error('Poll needs at least 2 options');
      return;
    }
    setNewPoll({
      ...newPoll,
      options: newPoll.options.filter((_, i) => i !== index),
    });
  };

  return {
    polls,
    loading,
    newPoll,
    setNewPoll,
    addPollOption,
    updatePollOption,
    removePollOption,
    createPoll,
    deletePoll,
    addChoice,
    deleteChoice,
    vote,
  };
};