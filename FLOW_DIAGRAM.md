# 🔄 Webnet App - User Flow Diagram

## 📱 **Complete User Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOME SCREEN                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Home Tab      │  │  Search Tab     │  │  Profile Tab    │ │
│  │                 │  │  (Notifications)│  │                 │ │
│  │ [🔴 Badge: 3]   │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATIONS SCREEN                        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Confirmed     │  │    Rejected     │  │  New Request   │ │
│  │   (Green)       │  │    (Red)        │  │   (Blue)        │ │
│  │                 │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPOINTMENT SCREENS                         │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ UserAppointments│  │ UserAppointments│  │ ProfessionalsList│ │
│  │ (Confirmed)     │  │ (Rejected)      │  │ (Search)        │ │
│  │                 │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 👤 **USER FLOW**

```
1. USER OPENS APP
   ↓
2. SEES HOME SCREEN WITH NOTIFICATION BADGE
   ↓
3. TAPS SEARCH TAB (NOTIFICATIONS)
   ↓
4. SEES NOTIFICATION BUTTONS:
   ├── "Confirmed" → Shows accepted appointments
   ├── "Rejected" → Shows rejected appointments
   └── "New Request" → Search for professionals
   ↓
5. USES APPROPRIATE BUTTON FOR DESIRED ACTION
```

## 👨‍💼 **PROFESSIONAL FLOW**

```
1. PROFESSIONAL OPENS APP
   ↓
2. SEES HOME SCREEN WITH NOTIFICATION BADGE
   ↓
3. TAPS SEARCH TAB (NOTIFICATIONS)
   ↓
4. SEES NOTIFICATION BUTTONS:
   ├── "Upcoming" → Shows confirmed appointments
   ├── "Pending" → Shows requests to approve
   └── "Past" → Shows completed appointments
   ↓
5. USES APPROPRIATE BUTTON FOR DESIRED ACTION
```

## 🔄 **APPOINTMENT STATUS FLOW**

```
PENDING (User books)
    ↓
    ├── ACCEPTED by Professional → CONFIRMED
    │   ↓
    │   └── COMPLETED after service
    │
    └── REJECTED by Professional → REJECTED
```

## 🎯 **BUTTON PURPOSES**

### **USER BUTTONS:**

- **"Confirmed"** → "Show me my upcoming appointments"
- **"Rejected"** → "Show me what got rejected"
- **"New Request"** → "I want to book a new service"

### **PROFESSIONAL BUTTONS:**

- **"Upcoming"** → "Show me what I need to do"
- **"Pending"** → "Show me what needs approval"
- **"Past"** → "Show me my completed work"

## 📊 **REAL EXAMPLES**

### **Example 1: John (User)**

1. John books appointment → PENDING
2. George accepts → CONFIRMED
3. John sees in "Confirmed" button
4. After service → COMPLETED

### **Example 2: Maria (User)**

1. Maria books appointment → PENDING
2. Alex rejects → REJECTED
3. Maria sees in "Rejected" button
4. Maria uses "New Request" to find another professional

### **Example 3: George (Professional)**

1. George receives 3 new requests → PENDING
2. George uses "Pending" to see them
3. George accepts 2, rejects 1
4. Accepted ones move to "Upcoming"
5. George uses "Past" to see completed work

This flow ensures both users and professionals can efficiently manage their appointments! 🎉
