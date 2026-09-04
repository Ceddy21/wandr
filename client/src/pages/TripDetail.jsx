import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Users, Edit, Trash2, Share2, Loader, Plus, Plane, Hotel, Utensils, Compass, MapPin, User, Clock, CheckCircle, X, Send, Image as ImageIcon, ThumbsUp, ThumbsDown, Activity, DollarSign, Wallet, UserPlus, MessageCircle, TrendingUp, FileText } from 'lucide-react';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [newMessage, setNewMessage] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

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
          destination: "Boracay, Philippines",
          startDate: "2025-05-10",
          endDate: "2025-05-15",
          status: "upcoming",
          progress: 0,
          members: [
            { id: 1, name: "Maya", role: "admin" },
            { id: 2, name: "Alex", role: "member" },
            { id: 3, name: "Sophie", role: "member" },
            { id: 4, name: "Tom", role: "member" }
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
        
        setNewActivity({
          ...newActivity,
          day: 1
        });
        
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const groupActivitiesByDay = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      if (!grouped[activity.day]) grouped[activity.day] = [];
      grouped[activity.day].push(activity);
    });
    return grouped;
  };

  const groupedActivities = groupActivitiesByDay(trip?.activities || []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

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
          <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-[#e8eaed] dark:border-dark-border rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text">
                {trip.destination}
              </h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                {getStatusLabel(trip.status)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-grey dark:text-dark-text-secondary">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {trip.destination.split(',')[0]}
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Itinerary</h3>
              <button
                onClick={() => setShowAddActivity(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
            </div>
            <div className="space-y-6">
              {Object.keys(groupedActivities).sort((a, b) => a - b).map(day => (
                <div key={day}>
                  <h4 className="font-medium text-deep-charcoal dark:text-dark-text mb-2 flex items-center gap-2">
                    <span className="text-sm text-warm-grey dark:text-dark-text-secondary">Day {day}</span>
                    <span className="text-xs text-warm-grey dark:text-dark-text-secondary">
                      ({new Date(new Date(trip.startDate).getTime() + (day - 1) * 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {groupedActivities[day].map(activity => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta transition-colors">
                        <span className="text-terracotta dark:text-dark-terracotta">{getActivityIcon(activity.type)}</span>
                        <span className="text-sm text-warm-grey dark:text-dark-text-secondary w-16">{activity.time}</span>
                        <span className="text-sm text-deep-charcoal dark:text-dark-text flex-1">{activity.title}</span>
                        <span className="text-xs text-warm-grey dark:text-dark-text-secondary capitalize bg-terracotta-soft dark:bg-dark-terracotta-soft px-2 py-0.5 rounded-full">
                          {activity.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedActivities).length === 0 && (
                <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No activities added yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Expenses</h3>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-4 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Total</p>
                <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">₱{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Per Person</p>
                <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">₱{perPerson}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Transactions</p>
                <p className="text-lg font-bold text-deep-charcoal dark:text-dark-text">{trip.expenses.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {trip.expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 border border-[#e8eaed] dark:border-dark-border rounded-lg hover:border-terracotta dark:hover:border-dark-terracotta transition-colors">
                  <div>
                    <p className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{expense.description}</p>
                    <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Paid by {expense.paidBy} • {expense.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-deep-charcoal dark:text-dark-text">₱{expense.amount}</p>
                    <p className="text-xs text-warm-grey dark:text-dark-text-secondary">Split {trip.members.length} ways</p>
                  </div>
                </div>
              ))}
              {trip.expenses.length === 0 && (
                <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No expenses added yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Chat</h3>
              <span className="text-xs text-warm-grey dark:text-dark-text-secondary">{trip.members.length} members</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {trip.messages.map(message => (
                <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg p-3 ${message.isOwn ? 'bg-terracotta text-white' : 'bg-terracotta-soft dark:bg-dark-terracotta-soft text-deep-charcoal dark:text-dark-text'}`}>
                    <p className="text-sm">{message.text}</p>
                    <span className="text-[10px] opacity-70 mt-1 block">{message.user} • {message.time}</span>
                  </div>
                </div>
              ))}
              {trip.messages.length === 0 && (
                <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No messages yet.</p>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-[#e8eaed] dark:border-dark-border pt-3">
              <label className="cursor-pointer p-2 rounded-lg hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors">
                <ImageIcon className="w-5 h-5 text-warm-grey dark:text-dark-text-secondary" />
                <input type="file" accept="image/*,video/*" className="hidden" />
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-terracotta dark:bg-dark-terracotta text-white hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-warm-grey dark:text-dark-text-secondary mt-1">
              Max 10MB per file. Supports: JPG, PNG, GIF, WebP, MP4, WebM
            </p>
          </div>
        )}

        {activeTab === 'polls' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-deep-charcoal dark:text-dark-text">Polls</h3>
              <button
                onClick={() => setShowCreatePoll(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-terracotta dark:bg-dark-terracotta text-white text-sm rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Poll
              </button>
            </div>
            <div className="space-y-4">
              {trip.polls.map(poll => (
                <div key={poll.id} className="p-4 border border-[#e8eaed] dark:border-dark-border rounded-lg">
                  <p className="font-medium text-deep-charcoal dark:text-dark-text">{poll.question}</p>
                  <p className="text-xs text-warm-grey dark:text-dark-text-secondary mb-3">Created by {poll.createdBy}</p>
                  <div className="space-y-2">
                    {poll.options.map(option => (
                      <div key={option} className="flex items-center gap-3 p-2 bg-terracotta-soft/30 dark:bg-dark-terracotta-soft/30 rounded-lg cursor-pointer hover:bg-terracotta-soft dark:hover:bg-dark-terracotta-soft transition-colors">
                        <span className="text-sm text-deep-charcoal dark:text-dark-text flex-1">{option}</span>
                        <span className="text-sm font-medium text-deep-charcoal dark:text-dark-text">{poll.votes[option] || 0} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {trip.polls.length === 0 && (
                <p className="text-warm-grey dark:text-dark-text-secondary text-center py-8">No polls created yet.</p>
              )}
            </div>
          </div>
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
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Paid By
                </label>
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
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
                >
                  Add Expense
                </button>
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
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Day
                </label>
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
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="9:00 AM"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Activity Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beach Tour"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Type
                </label>
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
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
                >
                  Add Activity
                </button>
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
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="What would you like to ask?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text placeholder:text-warm-grey/60 dark:placeholder:text-dark-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] dark:focus:ring-[#E76F51] focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Options
                </label>
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
                <button
                  onClick={addPollOption}
                  className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
                >
                  + Add Option
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5">
                  Created By
                </label>
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
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="px-4 py-2 border border-[#e8eaed] dark:border-dark-border text-deep-charcoal dark:text-dark-text rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePoll}
                  className="px-4 py-2 bg-terracotta dark:bg-dark-terracotta text-white rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetail;