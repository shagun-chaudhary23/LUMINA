import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchComplaints, submitComplaint, upvoteComplaint } from '../services/api';
import { assessComplaintSeverity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import LocationInput from '../components/LocationInput';
import { AlertTriangle, MapPin, Send, ThumbsUp, Filter, AlertCircle, Clock, ShieldAlert, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

export default function Complaint() {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');

  // Form State
  const [selectedPin, setSelectedPin] = useState({
    lat: 28.5528,
    lng: 77.2039,
    addressName: "Hauz Khas Village Entry Alley, New Delhi"
  });
  const [locationName, setLocationName] = useState("Hauz Khas Village Entry Alley, New Delhi");
  const [category, setCategory] = useState("Poor Lighting");
  const [description, setDescription] = useState("");
  const [advice, setAdvice] = useState("");
  const [imageProof, setImageProof] = useState(null); // Data URL base64 string

  // Feedback State
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadComplaints = async () => {
    const res = await fetchComplaints(selectedCategoryFilter, selectedTimeFilter);
    if (res.success) setComplaints(res.complaints);
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedCategoryFilter, selectedTimeFilter]);

  const handleMapClick = (resolvedData) => {
    setSelectedPin(resolvedData);
    setLocationName(resolvedData.addressName);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageProof(null);
  };

  const aiSeverity = assessComplaintSeverity(description);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuthModal();
      setFeedback({
        type: 'error',
        message: 'Please log in to submit a complaint. The sign-in modal has been opened for you.'
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      location: locationName,
      lat: selectedPin.lat,
      lng: selectedPin.lng,
      category,
      severity: aiSeverity,
      description,
      advice,
      imageProof,
      userId: user.id,
      aiAssessed: true
    };

    const res = await submitComplaint(payload);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: res.message || "Report registered successfully! Community verification initiated.",
        severity: res.complaint?.severity || aiSeverity,
        aiAssessed: true
      });
      // Clear form fields
      setDescription("");
      setAdvice("");
      setImageProof(null);
      loadComplaints();
    } else if (res.isSpam) {
      setFeedback({
        type: 'spam',
        message: res.error || "SPAM WARNING: Duplicate or invalid submission detected."
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.error || "Submission restricted. Maximum 2 daily submissions reached."
      });
    }
    setSubmitting(false);
  };

  const handleUpvote = async (id) => {
    const res = await upvoteComplaint(id);
    if (res.success) {
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, upvotes: res.upvotes, status: res.status } : c));
    }
  };

  return (
    <div className="space-y-12 py-6 pb-16">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-editorial-border dark:border-editorial-darkborder pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-bold uppercase">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Community Incident Portal</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-cream-50">
          {t('complaintTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
          {t('complaintSub')}
        </p>
      </div>

      {/* Main Grid: Form + Interactive Map Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder p-6 sm:p-8 rounded-2xl shadow-editorial space-y-6">
            
            <div className="flex items-center justify-between border-b border-editorial-border dark:border-editorial-darkborder pb-4">
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
                Log New Hazard / Incident
              </h3>
              <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md">
                Max 2 / Day Limit Active
              </span>
            </div>

            {/* Submission Alerts / Warnings */}
            {feedback && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                    : feedback.type === 'spam'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-300 font-semibold'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {feedback.type === 'spam' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                  {feedback.type === 'error' && <ShieldAlert className="w-4 h-4 text-red-600" />}
                  <span className="font-bold uppercase tracking-wider">
                    {feedback.type === 'success' ? 'Report Saved' : feedback.type === 'spam' ? 'Spam Alert Flagged' : 'Submission Restricted'}
                  </span>
                  {feedback.aiAssessed && feedback.severity && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                      AI-Assessed: {feedback.severity}
                    </span>
                  )}
                </div>
                <p className="leading-relaxed">{feedback.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Location Input with Autocomplete & Reverse Geocoding Map Pin Resolver */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-cream-200 mb-1">
                  Selected Location / Address
                </label>
                <LocationInput
                  value={locationName}
                  onChange={(val) => setLocationName(val)}
                  onSelectLocation={(loc) => {
                    setLocationName(loc.name);
                    setSelectedPin({ lat: loc.lat, lng: loc.lng, addressName: loc.name });
                  }}
                  placeholder="Click map pin or type location..."
                  required
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Click on the map to automatically fill real neighborhood name.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-cream-200 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white outline-none"
                  >
                    <option value="Poor Lighting">Poor Lighting</option>
                    <option value="Harassment & Catcalling">Harassment & Catcalling</option>
                    <option value="Stalking Incident">Stalking Incident</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
                    <option value="Lack of Public Transport">Lack of Public Transport</option>
                    <option value="Unsafe Dark Corridor">Unsafe Dark Corridor</option>
                    <option value="Others (details in description)">Others (details in description)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 px-4 py-3">
                  <div>
                    <div className="text-[11px] font-bold text-stone-700 dark:text-cream-200 uppercase tracking-wider">Severity Result</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">Assigned automatically from your description</div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    aiSeverity === 'Critical'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : aiSeverity === 'High'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                      : aiSeverity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    AI-Assessed • {aiSeverity}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-cream-200 mb-1">
                  Incident Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, unlit corners, or specific hazard..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-cream-200 mb-1">
                  Safety Advice / Tips for Other Women
                </label>
                <input
                  type="text"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="e.g., Use Exit 1 near PCR van; stay on lit avenue."
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red outline-none"
                />
              </div>

              {/* Optional Image Proof Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-cream-200 mb-1 flex items-center justify-between">
                  <span>Attach Image Proof (Optional)</span>
                  <span className="text-[10px] text-lumina-red font-semibold">Gives higher weight in route safety score</span>
                </label>
                
                {imageProof ? (
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 max-h-40">
                    <img src={imageProof} alt="Proof Preview" className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center space-x-2 p-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 hover:border-lumina-red cursor-pointer transition-colors text-xs text-stone-600 dark:text-stone-300 font-semibold">
                    <ImageIcon className="w-4 h-4 text-stone-400" />
                    <span>Click to upload photo evidence</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-lumina-red hover:bg-lumina-crimson text-white font-bold text-xs tracking-wider transition-all shadow-glow-red flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Verifying & Saving...' : t('submitReportBtn')}</span>
              </button>

            </form>

          </div>

        </div>

        {/* Map Column: Click to Pick Location & Resolve Area Name */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
              Select Incident Pin Location
            </h3>
            <span className="text-xs font-semibold text-lumina-red">Click map to set pin</span>
          </div>

          <MapComponent
            center={[selectedPin.lat, selectedPin.lng]}
            zoom={13}
            selectedPin={selectedPin}
            onMapClick={handleMapClick}
            markers={complaints}
            height="540px"
          />
        </div>

      </div>

      {/* ---------------- COMMUNITY COMPLAINTS FEED WITH TIME FILTER ---------------- */}
      <div className="space-y-6 pt-6 border-t border-editorial-border dark:border-editorial-darkborder">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-cream-50">
              {t('recentFeedTitle')}
            </h2>
            <p className="text-xs text-stone-500">Live community reports verified by anti-spam logic.</p>
          </div>

          {/* Time Window & Category Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 bg-white dark:bg-editorial-darkcard px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-transparent text-stone-800 dark:text-cream-100 outline-none font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="Poor Lighting">Poor Lighting</option>
                <option value="Harassment & Catcalling">Harassment</option>
                <option value="Stalking Incident">Stalking</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Others (details in description)">Others</option>
              </select>
            </div>

            {/* Time Window Filter */}
            <div className="flex items-center space-x-1.5 bg-white dark:bg-editorial-darkcard px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="bg-transparent text-stone-800 dark:text-cream-100 outline-none font-semibold"
              >
                <option value="All Time">All Time</option>
                <option value="Last Hour">Last Hour</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
              </select>
            </div>

          </div>
        </div>

        {/* Complaints Grid */}
        {complaints.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-editorial-darkcard rounded-2xl border border-editorial-border dark:border-editorial-darkborder text-stone-500 text-xs">
            No complaints found for the selected category and time window.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map((cmp) => {
              const isCritical = cmp.severity === 'Critical';
              const isHigh = cmp.severity === 'High';

              return (
                <div
                  key={cmp.id}
                  className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 shadow-sm hover:shadow-editorial transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Top Bar: Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                        {cmp.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            isCritical
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300'
                              : isHigh
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {cmp.severity}
                        </span>
                        {cmp.aiAssessed && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                            AI-Assessed
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                          {cmp.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-700 dark:text-cream-200">
                      <MapPin className="w-3.5 h-3.5 text-lumina-red" />
                      <span>{cmp.location}</span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {cmp.description}
                    </p>

                    {cmp.imageProof && (
                      <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800">
                        <img src={cmp.imageProof} alt="Proof Evidence" className="w-full h-40 object-cover" />
                        <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-[10px] text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Photo Evidence Attached (Weighted Safety Priority)
                        </div>
                      </div>
                    )}

                    {cmp.advice && (
                      <div className="p-3 rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5">
                        <span className="font-bold text-lumina-red dark:text-lumina-rose block">Safety Advice:</span>
                        <span>"{cmp.advice}"</span>
                      </div>
                    )}

                  </div>

                  {/* Footer Bar: Date & Upvote */}
                  <div className="pt-4 border-t border-editorial-border/60 dark:border-editorial-darkborder/60 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center space-x-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(cmp.timestamp).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => handleUpvote(cmp.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cream-100 dark:bg-stone-800 hover:bg-lumina-red hover:text-white text-stone-700 dark:text-cream-200 font-bold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{cmp.upvotes || 0} Upvotes</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
