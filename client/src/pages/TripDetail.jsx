import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Users, Edit, Trash2, Share2, Loader, Plus, MapPin, User, Clock, CheckCircle, X, UserPlus, Search, UserX, AlertTriangle } from 'lucide-react';

import ChatTab from '../components/trip/ChatTab'
import ItineraryTab from '../components/trip/IteneraryTab';
import ExpensesTab from '../components/trip/ExpensesTab';
import PollsTab from '../components/trip/PollsTab';


function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [newMessage, setNewMessage] = useState('');

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [memberSearch, setMemberSearch] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const searchTimeout = useRef(null);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    date: ''
  });

  const [newActivity, setNewActivity] = useState({
    day: 1,
    time: '',
    title: '',
    type: 'activity'
  });

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    createdBy: ''
  });

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        // --- REPLACE WITH REAL API CALL ---
        // const response = await fetch(`http://localhost:5000/api/trips/${id}`);
        // if (!response.ok) throw new Error('Trip not found');
        // const data = await response.json();
        // setTrip(data);

        const mockTrip = {
          id: parseInt(id),
          name: "Bora 2025 with Friends",
          destination: "Boracay, Philippines",
          startDate: "2025-05-10",
          endDate: "2025-05-15",
          status: "upcoming",
          progress: 0,
          members: [
            { id: 1, name: "Maya", email: "maya@email.com", role: "admin" },
            { id: 2, name: "Alex", email: "alex@email.com", role: "member" },
            { id: 3, name: "Sophie", email: "sophie@email.com", role: "member" },
            { id: 4, name: "Tom", email: "tom@email.com", role: "member" }
          ],
          activities: [
            { id: 1, day: 1, time: "08:30", title: "Flight to Boracay", type: "flight" },
            { id: 2, day: 1, time: "14:00", title: "Hotel Check-in", type: "hotel" },
            { id: 3, day: 1, time: "19:00", title: "Dinner at Beachfront", type: "restaurant" },
            { id: 4, day: 2, time: "09:00", title: "Island Hopping Tour", type: "activity" },
            { id: 5, day: 2, time: "12:00", title: "Lunch at Coral Garden", type: "restaurant" }
          ],
          expenses: [
            { id: 1, description: "Flight tickets", amount: 2000, paidBy: "Maya", date: "2025-04-15" },
            { id: 2, description: "Hotel booking", amount: 1500, paidBy: "Alex", date: "2025-04-20" },
            { id: 3, description: "Dinner", amount: 500, paidBy: "Sophie", date: "2025-05-10" }
          ],
          messages: [
            { id: 1, user: "Maya", text: "I found a cheaper flight!", time: "2 hours ago", isOwn: true },
            { id: 2, user: "Alex", text: "Where did you find it?", time: "1 hour ago", isOwn: false },
            { id: 3, user: "Sophie", text: "Send me the link please", time: "45 min ago", isOwn: false }
          ],
          polls: [
            {
              id: 1,
              question: "Where should we eat dinner?",
              options: ["Italian", "Sushi", "Mexican"],
              votes: { Italian: 3, Sushi: 1, Mexican: 2 },
              createdBy: "Maya"
            }
          ]
        };
        setTrip(mockTrip);

        setNewExpense({
          ...newExpense,
          paidBy: mockTrip.members.length > 0 ? mockTrip.members[0].name : '',
          date: new Date().toISOString().split('T')[0]
        });

        setNewPoll({
          ...newPoll,
          createdBy: mockTrip.members.length > 0 ? mockTrip.members[0].name : ''
        });

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (trip) {
      document.title = `${trip.name || trip.destination} - Wanderly`;
    }
  }, [trip]);

  const handleDeleteTrip = () => {
    // --- REPLACE WITH REAL API CALL ---
    // const response = await fetch(`http://localhost:5000/api/trips/${id}`, { method: 'DELETE' });
    // if (!response.ok) throw new Error('Failed to delete trip');

    setShowDeleteConfirm(false);
    toast.success('Trip deleted successfully!');
    navigate('/dashboard');
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!memberSearch || memberSearch.length < 2) {
      setMemberSuggestions([]);
      return;
    }

    setIsSearchingMembers(true);
    searchTimeout.current = setTimeout(() => {
      // --- REPLACE WITH REAL API CALL ---
      // const response = await fetch(`http://localhost:5000/api/users/search?q=${memberSearch}`);
      // const data = await response.json();
      // setMemberSuggestions(data);

      const mockUsers = [
        { id: 5, name: "Jake", email: "jake@email.com" },
        { id: 6, name: "Emma", email: "emma@email.com" },
        { id: 7, name: "Liam", email: "liam@email.com" },
        { id: 8, name: "Olivia", email: "olivia@email.com" },
        { id: 9, name: "Noah", email: "noah@email.com" }
      ];
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
        !trip.members.some(m => m.id === user.id)
      );
      setMemberSuggestions(filtered);
      setIsSearchingMembers(false);
    }, 400);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [memberSearch, trip]);

  const handleAddMember = (user) => {
    const newMember = {
      id: user.id,
      name: user.name,
      email: user.email || `${user.name.toLowerCase()}@email.com`,
      role: 'member'
    };

    setTrip({
      ...trip,
      members: [...trip.members, newMember]
    });

    setSelectedMembers([...selectedMembers, newMember]);
    setMemberSearch('');
    setMemberSuggestions([]);
    toast.success(`${user.name} added to the trip!`);
  };

  const handleRemoveMember = (memberId) => {
    if (trip.members.find(m => m.id === memberId)?.role === 'admin') {
      toast.error('Cannot remove the admin.');
      return;
    }

    setTrip({
      ...trip,
      members: trip.members.filter(m => m.id !== memberId)
    });
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
    toast.success('Member removed.');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: trip.messages.length + 1,
      user: "You",
      text: newMessage.trim(),
      time: "Just now",
      isOwn: true
    };

    setTrip({
      ...trip,
      messages: [...trip.messages, newMsg]
    });

    toast.success('Message sent!');
    setNewMessage('');
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      toast.error('Please fill in all fields');
      return;
    }

    const expense = {
      id: trip.expenses.length + 1,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      date: newExpense.date || new Date().toISOString().split('T')[0]
    };

    setTrip({
      ...trip,
      expenses: [...trip.expenses, expense]
    });

    setShowAddExpense(false);
    setNewExpense({
      description: '',
      amount: '',
      paidBy: trip.members[0]?.name || '',
      date: new Date().toISOString().split('T')[0]
    });

    toast.success('Expense added!');
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.time) {
      toast.error('Please fill in all fields');
      return;
    }

    const activity = {
      id: trip.activities.length + 1,
      day: parseInt(newActivity.day) || 1,
      time: newActivity.time,
      title: newActivity.title,
      type: newActivity.type || 'activity'
    };

    setTrip({
      ...trip,
      activities: [...trip.activities, activity]
    });

    setShowAddActivity(false);
    setNewActivity({
      day: 1,
      time: '',
      title: '',
      type: 'activity'
    });

    toast.success('Activity added!');
  };

  const handleCreatePoll = () => {
    if (!newPoll.question || newPoll.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    const poll = {
      id: trip.polls.length + 1,
      question: newPoll.question,
      options: newPoll.options.filter(opt => opt.trim()),
      votes: {},
      createdBy: newPoll.createdBy || trip.members[0]?.name || 'Someone'
    };

    poll.options.forEach(opt => {
      poll.votes[opt] = 0;
    });

    setTrip({
      ...trip,
      polls: [...trip.polls, poll]
    });

    setShowCreatePoll(false);
    setNewPoll({
      question: '',
      options: ['', ''],
      createdBy: trip.members[0]?.name || ''
    });

    toast.success('Poll created!');
  };

  const addPollOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const updatePollOption = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({
      ...newPoll,
      options: updatedOptions
    });
  };

  const removePollOption = (index) => {
    if (newPoll.options.length <= 2) {
      toast.error('Poll needs at least 2 options');
      return;
    }
    const updatedOptions = newPoll.options.filter((_, i) => i !== index);
    setNewPoll({
      ...newPoll,
      options: updatedOptions
    });
  };

  const totalExpenses = trip?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const perPerson = trip?.members?.length ? (totalExpenses / trip.members.length).toFixed(2) : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

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
          <Link to="/dashboard" className="text-terracotta hover:underline mt-4 block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">

      <div className="flex items-center justify-between mb-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-warm-grey dark:text-dark-text-secondary hover:text-terracotta dark:hover:text-dark-terracotta transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors" title="Share">
            <Share2 className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          </button>
          <button className="p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors" title="Edit">
            <Edit className="w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
                {trip.name || trip.destination}
              </h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                {getStatusLabel(trip.status)}
              </span>
            </div>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {trip.destination}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-grey dark:text-dark-text-secondary mt-1">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {trip.members.slice(0, 5).map((member, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center border-2 border-white dark:border-dark-card" title={member.name}>
                  <span className="text-xs font-medium text-deep-charcoal dark:text-dark-text">{member.name.charAt(0)}</span>
                </div>
              ))}
              {trip.members.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-[#e8eaed] dark:bg-dark-border flex items-center justify-center border-2 border-white dark:border-dark-card">
                  <span className="text-xs text-warm-grey dark:text-dark-text-secondary">+{trip.members.length - 5}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
              {trip.members.length} members
            </span>
            <button
              onClick={() => setShowAddMembers(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#e8eaed] dark:border-dark-border mb-6 overflow-x-auto">
        {['itinerary', 'expenses', 'chat', 'polls'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-terracotta text-terracotta dark:border-dark-terracotta dark:text-dark-terracotta'
                : 'border-transparent text-warm-grey dark:text-dark-text-secondary hover:text-deep-charcoal dark:hover:text-dark-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

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
            newMessage={newMessage} 
            setNewMessage={setNewMessage} 
            onSendMessage={handleSendMessage} 
          />
        )}
        {activeTab === 'polls' && (
          <PollsTab trip={trip} onCreatePoll={() => setShowCreatePoll(true)} />
        )}
      </div>

      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddExpense(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Add Expense</h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Add a new expense to the trip.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Description</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Amount (₱)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Paid By</label>
                <select
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
                >
                  {trip.members.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowAddExpense(false)} className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">Cancel</button>
                <button onClick={handleAddExpense} className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors">Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddActivity(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Add Activity</h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Add a new activity to your itinerary.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Day</label>
                <select
                  value={newActivity.day}
                  onChange={(e) => setNewActivity({ ...newActivity, day: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
                >
                  {[...Array(7)].map((_, i) => (
                    <option key={i} value={i + 1}>Day {i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Time</label>
                <input
                  type="text"
                  placeholder="9:00 AM"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Activity Title</label>
                <input
                  type="text"
                  placeholder="e.g. Beach Tour"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Type</label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
                >
                  <option value="flight">Flight</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="activity">Activity</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowAddActivity(false)} className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">Cancel</button>
                <button onClick={handleAddActivity} className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors">Add Activity</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreatePoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreatePoll(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Create Poll</h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Create a poll for your trip members.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Question</label>
                <input
                  type="text"
                  placeholder="What would you like to ask?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Options</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={() => removePollOption(index)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button onClick={addPollOption} className="text-sm text-terracotta dark:text-dark-terracotta hover:underline">+ Add Option</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Created By</label>
                <select
                  value={newPoll.createdBy}
                  onChange={(e) => setNewPoll({ ...newPoll, createdBy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] transition-all duration-200"
                >
                  {trip.members.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowCreatePoll(false)} className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">Cancel</button>
                <button onClick={handleCreatePoll} className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors">Create Poll</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddMembers(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Add Members</h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">Search and invite friends to join this trip.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">Search for friends</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey dark:text-dark-text-secondary" />
                  <input
                    type="text"
                    placeholder="Type a name..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                  />
                  {isSearchingMembers && (
                    <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta dark:text-dark-terracotta animate-spin" />
                  )}
                </div>
              </div>
              {memberSuggestions.length > 0 && (
                <div className="border border-[#e8eaed] dark:border-dark-border rounded-lg divide-y divide-[#e8eaed] dark:divide-dark-border max-h-48 overflow-y-auto">
                  {memberSuggestions.map(user => (
                    <div key={user.id} className="flex items-center justify-between px-4 py-3 hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center">
                          <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{user.name}</p>
                          <p className="text-xs text-warm-grey dark:text-dark-text-secondary">{user.email}</p>
                        </div>
                      </div>
                      <button onClick={() => handleAddMember(user)} className="p-1.5 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {memberSearch.length >= 2 && memberSuggestions.length === 0 && !isSearchingMembers && (
                <div className="text-center py-4 text-warm-grey dark:text-dark-text-secondary">No users found</div>
              )}
              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-2">Current Members ({trip.members.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {trip.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between px-3 py-2 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center">
                          <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">
                            {member.name}
                            {member.role === 'admin' && <span className="ml-2 text-xs text-terracotta dark:text-dark-terracotta">(Admin)</span>}
                          </p>
                          <p className="text-xs text-warm-grey dark:text-dark-text-secondary">{member.email}</p>
                        </div>
                      </div>
                      {member.role !== 'admin' && (
                        <button onClick={() => handleRemoveMember(member.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                          <UserX className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowAddMembers(false)} className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 border border-[#e8eaed] dark:border-dark-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors"
            >
              <X className="w-5 h-5 text-deep-charcoal dark:text-dark-text" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-deep-charcoal dark:text-dark-text mb-2">Delete Trip</h2>
              <p className="text-sm text-warm-grey dark:text-dark-text-secondary mb-6">
                Are you sure you want to delete "<strong>{trip.name || trip.destination}</strong>"?
                This action cannot be undone and all trip data will be permanently removed.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors">Cancel</button>
                <button onClick={handleDeleteTrip} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete Trip</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetail;