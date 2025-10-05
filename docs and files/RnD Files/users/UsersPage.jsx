import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { getApiBaseUrl } from "@/utils/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const toast = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);

  useEffect(() => {
    getApiBaseUrl().then(setBaseUrl);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Note: We don't have a get users endpoint yet, so this will fail
      // We'll implement it later
      const response = await fetch(`${baseUrl}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Username and password are required",
      });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (data.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User added successfully",
        });
        setAddDialog(false);
        setNewUser({ username: "", password: "" });
        fetchUsers();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add user",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`${baseUrl}/users/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: selectedUser.username }),
      });

      const data = await response.json();

      if (data.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User deleted successfully",
        });
        setDeleteDialog(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: data.message,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete user",
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text"
        onClick={() => {
          setSelectedUser(rowData);
          setDeleteDialog(true);
        }}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <h2>User Management</h2>
        <Button
          label="Add User"
          icon="pi pi-plus"
          onClick={() => setAddDialog(true)}
          className="p-mb-3"
        />
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="No users found"
        >
          <Column field="id" header="ID" sortable />
          <Column field="username" header="Username" sortable />
          <Column field="created_at" header="Created At" sortable />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      </div>

      {/* Add User Dialog */}
      <Dialog
        header="Add New User"
        visible={addDialog}
        onHide={() => setAddDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setAddDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Add"
              icon="pi pi-check"
              onClick={handleAddUser}
              autoFocus
            />
          </div>
        }
      >
        <div className="p-field">
          <label htmlFor="username">Username</label>
          <InputText
            id="username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
        </div>
        <div className="p-field">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
        </div>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        header="Delete User"
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setDeleteDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Delete"
              icon="pi pi-check"
              onClick={handleDeleteUser}
              className="p-button-danger"
            />
          </div>
        }
      >
        <p>Are you sure you want to delete user "{selectedUser?.username}"?</p>
      </Dialog>
    </div>
  );
};

export default UsersPage;
