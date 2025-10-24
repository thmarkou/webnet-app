# 🎯 Webnet App - Mock Examples & User Flows

## 📱 **Complete User Journey Examples**

### **👤 USER SCENARIO: John (Regular User)**

#### **Step 1: John Books an Appointment**

- John opens the app and sees the **Home Screen** with notification badge showing "2"
- He taps the **Search tab** (now shows Notifications)
- He sees his notifications and taps **"New Request"** button
- This takes him to the **Professionals List** where he can search for services
- He finds "George Papadopoulos - Plumber" and books an appointment for "Kitchen sink repair"
- The appointment is created with status: **PENDING**

#### **Step 2: Professional Responds**

- George (Professional) receives a notification: "New Appointment Request from John Smith"
- George opens his notifications and sees the request
- George can either:
  - **Accept** → Status becomes **CONFIRMED**
  - **Reject** → Status becomes **REJECTED**

#### **Step 3: John Checks Status**

- John goes back to his **Notifications** screen
- He sees:
  - **"Confirmed"** button → Shows his confirmed appointments
  - **"Rejected"** button → Shows his rejected appointments
  - **"New Request"** button → Search for more professionals

---

### **👨‍💼 PROFESSIONAL SCENARIO: George (Plumber)**

#### **Step 1: George Receives Requests**

- George opens the app and sees **Home Screen** with notification badge "3"
- He taps **Search tab** (Notifications screen)
- He sees his notifications and can use:
  - **"Upcoming"** button → Shows confirmed appointments he needs to attend
  - **"Pending"** button → Shows appointment requests waiting for his approval
  - **"Past"** button → Shows completed appointments

#### **Step 2: George Manages Appointments**

- In **"Pending"** tab: He sees John's request for "Kitchen sink repair"
- He can **Accept** or **Reject** the appointment
- In **"Upcoming"** tab: He sees confirmed appointments he needs to attend
- In **"Past"** tab: He sees completed work and can track his earnings

---

## 🔄 **Complete Flow Examples**

### **Example 1: Successful Appointment**

1. **User (John)** books appointment → Status: PENDING
2. **Professional (George)** receives notification
3. **George** accepts → Status: CONFIRMED
4. **John** gets notification: "Appointment Confirmed"
5. **Both** can see appointment in their respective "Upcoming" tabs
6. **After completion** → Status: COMPLETED

### **Example 2: Rejected Appointment**

1. **User (Maria)** books appointment → Status: PENDING
2. **Professional (Alex)** receives notification
3. **Alex** rejects → Status: REJECTED
4. **Maria** gets notification: "Appointment Rejected"
5. **Maria** can use "Rejected" button to see rejected appointments
6. **Maria** can use "New Request" to find another professional

---

## 🎯 **Button Functions Explained**

### **👤 USER NOTIFICATION BUTTONS:**

#### **✅ "Confirmed" Button**

- **What it does**: Shows appointments that professionals have accepted
- **Example**: John booked with George → George accepted → John sees it in "Confirmed"
- **Screen**: UserAppointments (Upcoming tab)

#### **❌ "Rejected" Button**

- **What it does**: Shows appointments that professionals have rejected
- **Example**: Maria booked with Alex → Alex rejected → Maria sees it in "Rejected"
- **Screen**: UserAppointments (Past tab with rejected status)

#### **➕ "New Request" Button**

- **What it does**: Opens search to find new professionals
- **Example**: John wants to book another service → Taps "New Request" → Searches for electricians
- **Screen**: ProfessionalsList (Search screen)

### **👨‍💼 PROFESSIONAL NOTIFICATION BUTTONS:**

#### **📅 "Upcoming" Button**

- **What it does**: Shows confirmed appointments that need to be attended
- **Example**: George has 3 confirmed appointments this week → Sees them in "Upcoming"
- **Screen**: ProfessionalAppointments (Upcoming tab)

#### **⏰ "Pending" Button**

- **What it does**: Shows appointment requests waiting for approval
- **Example**: George has 2 new requests from users → Sees them in "Pending"
- **Screen**: ProfessionalAppointments (Upcoming tab with pending status)

#### **✅ "Past" Button**

- **What it does**: Shows completed appointments and earnings
- **Example**: George completed 5 jobs this month → Sees them in "Past"
- **Screen**: ProfessionalAppointments (Past tab)

---

## 📊 **Real-World Scenarios**

### **Scenario 1: Busy Professional**

- **George** has 10 pending requests
- He opens **"Pending"** to see all requests
- He accepts 7, rejects 3
- Accepted ones move to **"Upcoming"**
- Rejected ones notify users

### **Scenario 2: Active User**

- **John** has 3 confirmed appointments
- He opens **"Confirmed"** to see upcoming services
- He also has 1 rejected appointment
- He opens **"Rejected"** to see why it was rejected
- He uses **"New Request"** to find alternative professionals

### **Scenario 3: New User**

- **Maria** is new to the app
- She uses **"New Request"** to find professionals
- She books her first appointment
- She waits for professional response
- She gets notification when accepted/rejected

---

## 🎯 **Why These Buttons Exist**

### **For Users:**

- **"Confirmed"** → "Show me my upcoming appointments"
- **"Rejected"** → "Show me what got rejected so I can try again"
- **"New Request"** → "I want to book a new service"

### **For Professionals:**

- **"Upcoming"** → "Show me what I need to do today"
- **"Pending"** → "Show me what needs my approval"
- **"Past"** → "Show me my completed work and earnings"

---

## 🔄 **Complete User Journey**

### **User Journey:**

1. **Home** → See notification badge
2. **Notifications** → See all notifications
3. **"New Request"** → Search for professionals
4. **Book appointment** → Wait for response
5. **"Confirmed"** → See accepted appointments
6. **"Rejected"** → See rejected appointments (if any)

### **Professional Journey:**

1. **Home** → See notification badge
2. **Notifications** → See all notifications
3. **"Pending"** → Review appointment requests
4. **Accept/Reject** → Make decisions
5. **"Upcoming"** → See confirmed appointments
6. **"Past"** → Track completed work

This system ensures both users and professionals can efficiently manage their appointments and stay informed about all activities! 🎉
