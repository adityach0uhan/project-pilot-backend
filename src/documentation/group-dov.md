### Group Management API Documentation

#### Base URL
```
http://localhost:5000/group
```

---

### **Endpoints**

#### **1. Create a New Group**
**POST** `/create`  
Creates a new group.  

**Body:**  
```json
{
    "name": "Project Phoenix",
    "groupNumber": 1,
    "members": ["memberId1", "memberId2"],
    "project": "Building a student management system",
    "createdBy": "creatorId",
    "groupleader": "leaderId",
    "semester": 6
}
```  

**Response:**  
- **201:** Group created successfully.  
- **400:** Missing required fields or user is already part of a group.  
- **500:** Internal server error.  

---

#### **2. Join a Group by Invite Code**  
**POST** `/join/:inviteCode`  

**Params:**  
- `inviteCode` — Unique invite code of the group.  

**Body:**  
```json
{
    "userId": "studentId"
}
```  

**Response:**  
- **200:** User joined successfully.  
- **404:** Group not found.  
- **400:** User is already a member of the group.  
- **500:** Internal server error.  

---

#### **3. Kick a Member from a Group**  
**PUT** `/:groupId/kick/:memberId`  

**Params:**  
- `groupId` — ID of the group.  
- `memberId` — ID of the member to be removed.  

**Response:**  
- **200:** Member removed successfully.  
- **404:** Group not found.  
- **500:** Internal server error.  

---

#### **4. Get Group Information**  
**GET** `/groupInfo`  
Retrieves group details where the user is a member.  

**Body:**  
```json
{
    "userId": "studentId"
}
```  

**Response:**  
- **200:** Group details returned successfully.  
- **404:** Group not found.  
- **500:** Internal server error.  

---

#### **5. Get All Groups for a Semester**  
**GET** `/getAllGroups`  

**Body:**  
```json
{
    "semester": 6
}
```  

**Response:**  
- **200:** Groups retrieved successfully.  
- **404:** No groups found.  
- **500:** Internal server error.  

---

#### **6. Get Group by ID**  
**GET** `/:groupId`  

**Params:**  
- `groupId` — ID of the group.  

**Response:**  
- **200:** Group details retrieved successfully.  
- **404:** Group not found.  
- **500:** Internal server error.  

---

#### **7. Update Group Details**  
**PUT** `/:groupId`  

**Params:**  
- `groupId` — ID of the group.  

**Body:**  
```json
{
    "name": "Updated Name",
    "groupNumber": 2,
    "project": "Updated Project",
    "semester": 7
}
```  

**Response:**  
- **200:** Group updated successfully.  
- **404:** Group not found.  
- **500:** Internal server error.  

---

#### **8. Delete a Group**  
**DELETE** `/:groupId`  

**Params:**  
- `groupId` — ID of the group.  

**Response:**  
- **200:** Group deleted successfully.  
- **404:** Group not found.  
- **500:** Internal server error.  