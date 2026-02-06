import { Loader2 } from "lucide-react";
import FormGroup from "./FormGroup";
import "../../styles/form.css";

const PasswordTab = ({
  passwords,
  setPasswords,
  onSave,
  isSaving,
}) => (
  <div className="max-w-lg space-y-6 animate-in fade-in duration-500">
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Change Password
      </h2>
      <p className="text-gray-500 text-sm mt-1">
        Ensure your account is using a long, random password to stay secure.
      </p>
    </div>

    <FormGroup label="New Password">
      <input
        type="password"
        value={passwords.new}
        onChange={(e) =>
          setPasswords({ ...passwords, new: e.target.value })
        }
        className="input-field"
        placeholder="••••••••"
      />
    </FormGroup>

    <FormGroup label="Confirm Password">
      <input
        type="password"
        value={passwords.confirm}
        onChange={(e) =>
          setPasswords({ ...passwords, confirm: e.target.value })
        }
        className="input-field"
        placeholder="••••••••"
      />
    </FormGroup>

    <div className="pt-4">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="btn-primary"
      >
        {isSaving ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          "Change Password"
        )}
      </button>
    </div>
  </div>
);

export default PasswordTab;
