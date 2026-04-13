export const database = `type User = { id: number; name: string };
type SuccessResponse<T> = { ok: true; data: T };

export default function(doo: Doo) {
  // Get all users
  doo.get<SuccessResponse<User[]>>("/users", async (req) => {
    const users = (await doo.db.get("users")) || [];
    return { ok: true, data: users };
  });

  // Create a new user
  doo.post<SuccessResponse<User>>("/users", async (req: DooRequest<User>) => {
    const users = (await doo.db.get("users")) || [];
    const newUser = { 
      id: Date.now(), 
      name: req.body.name || "Anonymous" 
    };
    
    users.push(newUser);
    await doo.db.set("users", users);
    
    doo.log(\`Created user: \${newUser.name}\`);
    return { ok: true, data: newUser };
  });
}`;
