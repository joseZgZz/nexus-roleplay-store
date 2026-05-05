const axios = require('axios');

const testRegister = async () => {
    try {
        const payload = {
            username: "testuser_" + Date.now(),
            email: "test_" + Date.now() + "@example.com",
            password: "Password123!",
            birthdate: "2000-01-01",
            platform: "PC"
        };
        console.log("Sending payload:", payload);
        const res = await axios.post('http://localhost:5000/api/auth/register', payload);
        console.log("Response SUCCESS:", res.data.message);
        const token = res.data.token;

        // Test checkAuth
        console.log("Testing /api/user/me with token...");
        const meRes = await axios.get('http://localhost:5000/api/user/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("checkAuth SUCCESS! Username:", meRes.data.username);
    } catch (err) {
        if (err.response) {
            console.error("Response ERROR:", err.response.status, err.response.data);
        } else {
            console.error("Network ERROR:", err.message);
        }
    }
};

testRegister();
