import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTrip } from '../hooks/useTrip';
import { useUser } from '../hooks/useUser';
import { useTripMembers } from '../hooks/useTripMembers';
import { useTripExpenses } from '../hooks/useTripExpenses';
import { useTripItinerary } from '../hooks/useTripItinerary';
import { useTripPolls } from '../hooks/useTripPolls';
import { useTripMessages } from '../hooks/useTripMessages';
import { TripInfoHeader } from '../components/trip/shared/TripInfoHeader';
import { TripTabs } from '../components/trip/shared/TripTabs';
import ChatTab from '../components/trip/ChatTab';
import ItineraryTab from '../components/trip/ItineraryTab';
import ExpensesTab from '../components/trip/ExpensesTab';
import PollsTab from '../components/trip/PollsTab';
import { AddExpenseModal } from '../components/trip/modals/AddExpenseModal';
import { AddActivityModal } from '../components/trip/modals/AddActivityModal';
import { CreatePollModal } from '../components/trip/modals/CreatePollModal';
import { AddMembersModal } from '../components/trip/modals/AddMembersModal';
import { DeleteConfirmModal } from '../components/trip/modals/DeleteConfirmModal';
import { ShareTripModal } from '../components/trip/modals/ShareTripModal';
import { EditTripModal } from '../components/trip/modals/EditTripModal';

const VALID_TABS = ['itinerary', 'expenses', 'chat', 'polls', 'members'];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TripDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user: currentUser } = useUser();
  const currentUserId = currentUser?._id || currentUser?.id;

  const { trip, setTrip, loading, deleteTrip } = useTrip(id);

  const membersHook = useTripMembers(id, trip, setTrip);
  const expensesHook = useTripExpenses(id, trip);
  const itineraryHook = useTripItinerary(id);
  const pollsHook = useTripPolls(id);
  const messagesHook = useTripMessages(id);

  const tabFromUrl = searchParams.get('tab');
  const initialTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'itinerary';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);

  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  const handleUpdateTrip = async (updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update trip');
      setTrip(data);
      toast.success('Trip updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update trip');
      throw err;
    }
  };

  const totalExpenses = expensesHook.expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const perPerson = trip?.members?.length
    ? (totalExpenses / trip.members.length).toFixed(2)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <Loader className="w-8 h-8 animate-spin text-terracotta dark:text-dark-terracotta" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Trip not found</p>
          <a href="/dashboard" className="text-terracotta hover:underline mt-4 block">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <TripInfoHeader
        trip={trip}
        currentUser={currentUser}
        onDelete={() => setShowDeleteConfirm(true)}
        onAddMembers={() => setShowAddMembers(true)}
        onShare={() => setShowShare(true)}
        onEdit={() => setShowEditTrip(true)}
      />

      <TripTabs activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 min-h-[400px]">
        {activeTab === 'itinerary' && (
          <ItineraryTab
            trip={trip}
            itinerary={itineraryHook.itinerary}
            onAddActivity={() => setShowAddActivity(true)}
            onUpdateActivity={itineraryHook.updateActivity}
            onDeleteActivity={itineraryHook.deleteActivity}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            trip={trip}
            expenses={expensesHook.expenses}
            totalExpenses={totalExpenses}
            perPerson={perPerson}
            onAddExpense={() => setShowAddExpense(true)}
            onUpdateExpense={expensesHook.updateExpense}
            onDeleteExpense={expensesHook.deleteExpense}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab
            currentUserId={currentUserId}
            messages={messagesHook.messages}
            newMessage={messagesHook.newMessage}
            setNewMessage={messagesHook.setNewMessage}
            onSendMessage={messagesHook.sendMessage}
            onEditMessage={messagesHook.editMessage}
            onDeleteMessage={messagesHook.deleteMessage}
            onMarkRead={messagesHook.markAsRead}
          />
        )}

        {activeTab === 'polls' && (
          <PollsTab
            trip={trip}
            polls={pollsHook.polls}
            currentUser={currentUser}
            onCreatePoll={() => setShowCreatePoll(true)}
            onDeletePoll={pollsHook.deletePoll}
            onAddChoice={pollsHook.addChoice}
            onDeleteChoice={pollsHook.deleteChoice}
            onVote={pollsHook.vote}
          />
        )}
      </div>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        trip={trip}
        newExpense={expensesHook.newExpense}
        setNewExpense={expensesHook.setNewExpense}
        onAdd={async () => {
          const result = await expensesHook.addExpense();
          if (result?.success) setShowAddExpense(false);
        }}
      />

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        newActivity={itineraryHook.newActivity}
        setNewActivity={itineraryHook.setNewActivity}
        onAdd={async () => {
          const result = await itineraryHook.addActivity();
          if (result?.success) setShowAddActivity(false);
        }}
      />

      <CreatePollModal
        isOpen={showCreatePoll}
        onClose={() => setShowCreatePoll(false)}
        trip={trip}
        newPoll={pollsHook.newPoll}
        setNewPoll={pollsHook.setNewPoll}
        addOption={pollsHook.addPollOption}
        updateOption={pollsHook.updatePollOption}
        removeOption={pollsHook.removePollOption}
        onCreate={async () => {
          const result = await pollsHook.createPoll();
          if (result?.success) {
            setShowCreatePoll(false);
          }
        }}
      />

      <AddMembersModal
        isOpen={showAddMembers}
        onClose={() => setShowAddMembers(false)}
        trip={trip}
        currentUser={currentUser}
        memberSearch={membersHook.memberSearch}
        setMemberSearch={membersHook.setMemberSearch}
        memberSuggestions={membersHook.memberSuggestions}
        isSearchingMembers={membersHook.isSearchingMembers}
        onAddMember={membersHook.addMember}
        onRemoveMember={membersHook.removeMember}
      />

      <ShareTripModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        trip={trip}
      />

      <EditTripModal
        isOpen={showEditTrip}
        onClose={() => setShowEditTrip(false)}
        trip={trip}
        onSave={handleUpdateTrip}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteTrip}
        tripName={trip.name || trip.destination}
      />
    </div>
  );
}

export default TripDetail;