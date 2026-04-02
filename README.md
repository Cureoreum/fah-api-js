# Folding@home API Utility

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/foldingathome-api/blob/main/LICENSE)
[![npm](https://img.shields.io/badge/npm-publish-success.svg)](https://www.npmjs.com/package/foldingathome-api)

A Node.js CommonJS utility for interacting with the [Folding@home Public API](https://foldingathome.org/folding-at-home-public-api/). This library provides a clean, modular interface to access project data, user statistics, team information, GPU data, and account management endpoints.

## Features

- ✅ Full Folding@home API v2.0.0 support
- ✅ Environment-based configuration (`.env` support)
- ✅ Promise-based async/await API
- ✅ Automatic query parameter handling
- ✅ Comprehensive error handling
- ✅ Debug logging mode
- ✅ TypeScript-friendly code structure
- ✅ No external dependencies besides `dotenv`

## Installation

### Install Dependencies

```bash
npm install dotenv
```

### Include the Module

```bash
# Clone this repository or copy the file into your project
cp foldingathome-api.js your-project/
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Folding@home API Configuration
FAH_API_BASE_URL=https://api.foldingathome.org
FAH_API_TIMEOUT=30000
FAH_DEBUG=false
```

| Variable | Description | Default |
|----------|-------------|---------|
| `FAH_API_BASE_URL` | Base URL for the API | `https://api.foldingathome.org` |
| `FAH_API_TIMEOUT` | Request timeout in milliseconds | `30000` |
| `FAH_DEBUG` | Enable debug logging (`true`/`false`) | `false` |

> **Security Note:** Never commit `.env` to version control. Add it to `.gitignore`.

### Constructor Options

You can override environment variables via constructor:

```javascript
const FoldingAtHomeAPI = require('./foldingathome-api');

const fah = new FoldingAtHomeAPI({
    baseUrl: 'https://api.foldingathome.org',
    timeout: 60000,
    debug: true
});
```

## Usage

### Basic Example

```javascript
const FoldingAtHomeAPI = require('./foldingathome-api');

async function main() {
    const fah = new FoldingAtHomeAPI();

    try {
        // Get top users
        const users = await fah.getAllTopUsers();
        console.log('Top users:', users.results);

        // Get specific user info
        const userInfo = await fah.getUserByName('ExampleUser');
        console.log('User:', userInfo);

        // Get team info
        const teamInfo = await fah.getTeamById(1);
        console.log('Team:', teamInfo);

    } catch (error) {
        console.error('API Error:', error.message);
    }
}

main();
```

## API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAllTopUsers()` | `GET /user` | Returns all-time top users by total score |
| `getMonthlyTopUsers(month, year)` | `GET /user/monthly` | Returns monthly top users |
| `getUserByName(name, passkey, team)` | `GET /user/{name}` | Returns user information by name |
| `getUserTeams(name, passkey, team)` | `GET /user/{name}/teams` | Returns user's teams |
| `getUserProjects(name)` | `GET /user/{name}/projects` | Returns user's projects |
| `getUserStats(name, passkey, team)` | `GET /user/{name}/stats` | Returns user statistics |
| `searchUsers(query)` | `GET /search/user` | Search for users |
| `getUserById(uid, passkey, team)` | `GET /uid/{uid}` | Returns user by ID |
| `getUserTotals(uid, passkey)` | `GET /uid/{uid}/totals` | Returns user totals |
| `getPasskey(email, user)` | `PUT /passkey` | Request/retrieve passkey |
| `getBonusStatus(passkey, user)` | `GET /bonus` | Check bonus status |
| `getUserCount()` | `GET /user-count` | Get total user count |

### Team Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getTeams(query)` | `GET /team` | Returns list of teams |
| `getMonthlyTeams(month, year)` | `GET /team/monthly` | Returns monthly team rankings |
| `findTeamByName(name)` | `GET /team/find` | Find team by name |
| `createTeam(data)` | `POST /team/create` | Create new team |
| `getTeamCount()` | `GET /team/count` | Get total team count |
| `getTeamById(team)` | `GET /team/{team}` | Get team information |
| `updateTeam(team, data)` | `PUT /team/{team}` | Update team |
| `deleteTeam(team, password)` | `DELETE /team/{team}` | Delete team |
| `getTeamMembers(team)` | `GET /team/{team}/members` | Get team members |
| `getTeamAccounts(team, count)` | `GET /team/{team}/accounts` | Get team accounts |
| `resetTeam(team, code, password)` | `PUT /team/{team}/reset` | Reset team password |

### Stats Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAssignmentServers()` | `GET /as` | Get list of Assignment Servers |
| `getCpuData(query)` | `GET /cpus` | Get CPU data |
| `getOsStats(days)` | `GET /os` | Get OS/GPU statistics |
| `getCreditLog(count, start)` | `GET /credit-log` | Get credit log |

### GPU Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getGPUs()` | `GET /gpus` | Get all supported GPUs |
| `getGpuByVendorAndDevice(vendor, device)` | `GET /gpus/{vendor}/{device}` | Get specific GPU |
| `updateGpu(vendor, device, data)` | `PUT /gpus/{vendor}/{device}` | Update GPU info |
| `deleteGpu(vendor, device)` | `DELETE /gpus/{vendor}/{device}` | Delete GPU entry |

### Account Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `registerAccount(data)` | `PUT /register` | Register new account |
| `login(email, password)` | `GET /login` | Login user |
| `getAccount()` | `GET /account` | Get logged-in account |
| `updateAccount(data)` | `PUT /account` | Update account |
| `deleteAccount()` | `DELETE /account` | Delete account |
| `getAccountSecret(password)` | `GET /account/secret` | Get account secret |
| `createAccountTeam(data)` | `POST /account/teams` | Create team |
| `getMachine(id)` | `GET /machine/{id}` | Get machine info |

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getProjects()` | `GET /project` | Get project information |

## Error Handling

All methods return Promises and throw errors on failure:

```javascript
const FoldingAtHomeAPI = require('./foldingathome-api');

const fah = new FoldingAtHomeAPI();

async function handleError() {
    try {
        const data = await fah.getUserByName('NonExistentUser');
    } catch (error) {
        if (error.message.startsWith('HTTP')) {
            console.log('Server error:', error.message);
        } else if (error.message === 'Request timeout') {
            console.log('Request timed out');
        } else {
            console.log('Network error:', error.message);
        }
    }
}
```

### Common Error Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `400` | Bad Request (invalid parameters) |
| `401` | Unauthorized (invalid passkey) |
| `404` | Not Found (user/team not found) |
| `500` | Internal Server Error |
| `Timeout` | Request exceeded timeout limit |

## Debug Mode

Enable debug logging to see all API requests:

```javascript
// Via .env
FAH_DEBUG=true

// Via constructor
const fah = new FoldingAtHomeAPI({ debug: true });
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Credits

- **Folding@home API** - [foldingathome.org](https://foldingathome.org/)
- **OpenAPI Specification v2.0.0** - Based on [Folding@home Public API](https://foldingathome.org/folding-at-home-public-api/)
- **Author** - Your Name / Your Organization

## Acknowledgments

This library is provided as-is for educational and research purposes. Please follow Folding@home's [API Usage Guidelines](https://foldingathome.org/folding-at-home-public-api/) when using the API.

---

<div align="center">

**Made with ❤️ for the Folding@home Community**

</div>