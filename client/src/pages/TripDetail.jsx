import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';

import { useTrip } from '../hooks/useTrip';
import { useTripMembers } from '../hooks/useTripMembers';
import { useTripExpenses } from '../hooks/useTripExpenses';
import { useTripActivities } from '../hooks/useTripActivities';
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

function TripDetail() {
  const { id } = useParams();

  const { trip, setTrip, loading, deleteTrip } = useTrip(id);

  const membersHook = useTripMembers(id, trip, setTrip);
  const expensesHook = useTripExpenses(id, trip, setTrip);
  const activitiesHook = useTripActivities(id, trip, setTrip);
  const pollsHook = useTripPolls(id, trip, setTrip);
  const messagesHook = useTripMessages(id, trip, setTrip);

  const [activeTab, setActiveTab] = useState('itinerary');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalExpenses = trip?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const perPerson = trip?.members?.length ? (totalExpenses / trip.members.length).toFixed(2) : 0;

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
        onDelete={() => setShowDeleteConfirm(true)}
        onAddMembers={() => setShowAddMembers(true)}
      />

      <TripTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 min-h-[400px]">
        {activeTab === 'itinerary' && (
          <ItineraryTab trip={trip} onAddActivity={() => setShowAddActivity(true)} />
        )}
        {activeTab === 'expenses' && (
          <ExpensesTab
            trip={trip}
            totalExpenses={totalExpenses}
            perPerson={perPerson}
            onAddExpense={() => setShowAddExpense(true)}
          />
        )}
        {activeTab === 'chat' && (
          <ChatTab
            trip={trip}
            newMessage={messagesHook.newMessage}
            setNewMessage={messagesHook.setNewMessage}
            onSendMessage={messagesHook.sendMessage}
          />
        )}
        {activeTab === 'polls' && (
          <PollsTab trip={trip} onCreatePoll={() => setShowCreatePoll(true)} />
        )}
      </div>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        trip={trip}
        newExpense={expensesHook.newExpense}
        setNewExpense={expensesHook.setNewExpense}
        onAdd={expensesHook.addExpense}
      />

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        newActivity={activitiesHook.newActivity}
        setNewActivity={activitiesHook.setNewActivity}
        onAdd={activitiesHook.addActivity}
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
        onCreate={pollsHook.createPoll}
      />

      <AddMembersModal
        isOpen={showAddMembers}
        onClose={() => setShowAddMembers(false)}
        trip={trip}
        memberSearch={membersHook.memberSearch}
        setMemberSearch={membersHook.setMemberSearch}
        memberSuggestions={membersHook.memberSuggestions}
        isSearchingMembers={membersHook.isSearchingMembers}
        onAddMember={membersHook.addMember}
        onRemoveMember={membersHook.removeMember}
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