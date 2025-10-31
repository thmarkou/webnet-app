# iOS Build Instructions - Build 41

## Προετοιμασία

1. **Ανοίξτε το Xcode project:**
   ```bash
   open ios/webnetapp.xcworkspace
   ```
   ⚠️ **ΣΗΜΑΝΤΙΚΟ**: Ανοίξτε το `.xcworkspace` και όχι το `.xcodeproj`

## Build & Deploy στο Device

### Βήμα 1: Επιλέξτε το Device
1. Στο Xcode, στο πάνω μέρος, δίπλα στο όνομα του project, κάντε click στο dropdown
2. Επιλέξτε το **iPhone/iPad** σας που είναι συνδεδεμένο (θα εμφανίζεται στη λίστα)
3. Αν δεν βλέπετε το device, βεβαιωθείτε ότι:
   - Το iPhone/iPad είναι **unlocked** (ξεκλειδωμένο)
   - Έχετε **εμπιστοσύνη** (trust) στον υπολογιστή σας στο device
   - Το **USB cable** είναι σωστά συνδεδεμένο

### Βήμα 2: Επιλέξτε Build Configuration
- Για Development: Επιλέξτε **"webnetapp" → Your iPhone**
- Για Release: **Product → Scheme → Edit Scheme** → Επιλέξτε **Release**

### Βήμα 3: Build & Run
1. Πατήστε **Cmd + R** (ή **Product → Run**)
2. Το Xcode θα:
   - Κάνει build την εφαρμογή
   - Την εγκαταστήσει στο device
   - Την ανοίξει αυτόματα

### Αν προκύψει σφάλμα Code Signing:

1. **Πηγαίνετε στο Target Settings:**
   - Κάντε click στο **"webnetapp"** project (αριστερά)
   - Επιλέξτε το **Target "webnetapp"**
   - Καρτέλα **"Signing & Capabilities"**

2. **Επιλέξτε Team:**
   - Επιλέξτε το **Apple ID** σας από το dropdown "Team"
   - Το Xcode θα δημιουργήσει αυτόματα provisioning profile

3. **Bundle Identifier:**
   - Βεβαιωθείτε ότι είναι: `com.fmarkou.webnetapp`

## Build Number

- **Current Build:** 41
- **Version:** 1.0.0

## Troubleshooting

### "Unable to install 'webnetapp'"
- Βεβαιωθείτε ότι το device είναι unlocked
- Μεταβείτε στο device: **Settings → General → VPN & Device Management** → Επικυρώστε το certificate

### "No such module 'ExpoModulesCore'"
```bash
cd ios
pod install
```

### Clean Build
Αν έχετε προβλήματα, κάντε clean:
1. **Product → Clean Build Folder** (Cmd + Shift + K)
2. **Product → Build** (Cmd + B)
3. **Product → Run** (Cmd + R)

