"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

export function RoleSelector() {
  const { user, login, setRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  useEffect(() => {
    // This is a mock of a "first time login" check.
    if (user && !localStorage.getItem(`role_selected_${user.id}`)) {
      setIsOpen(true);
    } else if (!user) {
        // Simple mock of guest user being prompted to login and select role
        const hasBeenPrompted = sessionStorage.getItem('hasBeenPrompted');
        if(!hasBeenPrompted) {
            setIsOpen(true);
            sessionStorage.setItem('hasBeenPrompted', 'true');
        }
    }
  }, [user]);

  const handleSelectRole = () => {
    if(user) {
        setRole(selectedRole);
        localStorage.setItem(`role_selected_${user.id}`, "true");
    } else {
        login(selectedRole);
        localStorage.setItem(`role_selected_${selectedRole}-mock-id`, "true");
    }
    setIsOpen(false);
  };
  
  const roles: {value: UserRole, label: string, description: string}[] = [
      {value: 'student', label: 'Student', description: 'Access resources, track your mood, and connect with peers.'},
      {value: 'volunteer', label: 'Volunteer', description: 'Support the community by moderating forums and offering peer support.'},
      {value: 'counsellor', label: 'Counsellor', description: 'Provide professional guidance and support to students.'},
      {value: 'management', label: 'Management', description: 'Oversee app operations and view analytics.'},
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to SoulSync!</DialogTitle>
          <DialogDescription>
            To personalize your experience, please select your role.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <RadioGroup defaultValue="student" onValueChange={(value: UserRole) => setSelectedRole(value)}>
                {roles.map((role) => (
                     <Label key={role.value} htmlFor={role.value} className="flex flex-col space-y-1">
                        <Card className="p-4 hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value={role.value} id={role.value} />
                                <div className="font-semibold">{role.label}</div>
                            </div>
                             <div className="pl-7 pt-1 text-sm text-muted-foreground">{role.description}</div>
                        </Card>
                     </Label>
                ))}
            </RadioGroup>
        </div>
        <Button onClick={handleSelectRole} className="w-full">Continue</Button>
      </DialogContent>
    </Dialog>
  );
}
