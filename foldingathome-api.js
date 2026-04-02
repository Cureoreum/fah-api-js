const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const URL = require('url').URL;

dotenv.config();

class FoldingAtHomeAPI {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.FAH_API_BASE_URL || 'https://api.foldingathome.org';
        this.timeout = parseInt(config.timeout || process.env.FAH_API_TIMEOUT || '30000', 10);
        this.headers = config.headers || {};
        
        this.debug = process.env.FAH_DEBUG === 'true' || config.debug === true;
    }

    /**
     * Make HTTP request to Folding@home API
     * @private
     */
    _request(method, path, params = {}) {
        // Construct URL
        const urlObj = new URL(path.startsWith('/') ? path.slice(1) : path, this.baseUrl);

        // Append query parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                urlObj.searchParams.append(key, value.toString());
            }
        });

        const url = urlObj.toString();

        if (this.debug) {
            console.log(`[FAH API] ${method} ${url}`);
        }

        const httpModule = url.startsWith('https') ? https : http;

        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                ...this.headers
            },
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            const req = httpModule.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            resolve(data); // Return raw string if not JSON
                        }
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            req.end();
        });
    }

    // --- USER ENDPOINTS ---

    async getAllTopUsers() {
        return this._request('GET', '/user');
    }

    async getMonthlyTopUsers(month, year) {
        return this._request('GET', '/user/monthly', { month, year });
    }

    async getUserByName(name, passkey = null, team = null) {
        return this._request('GET', `/user/${encodeURIComponent(name)}`, { passkey, team });
    }

    async getUserTeams(name, passkey = null, team = null) {
        return this._request('GET', `/user/${encodeURIComponent(name)}/teams`, { passkey, team });
    }

    async getUserProjects(name) {
        return this._request('GET', `/user/${encodeURIComponent(name)}/projects`);
    }

    async getUserStats(name, passkey = null, team = null) {
        return this._request('GET', `/user/${encodeURIComponent(name)}/stats`, { passkey, team });
    }

    async searchUsers(query) {
        return this._request('GET', '/search/user', { query });
    }

    async getUserById(uid, passkey = null, team = null) {
        return this._request('GET', `/uid/${uid}`, { passkey, team });
    }

    async getUserTotals(uid, passkey = null) {
        return this._request('GET', `/uid/${uid}/totals`, { passkey });
    }

    async getUserTeamsById(uid, passkey = null, team = null) {
        return this._request('GET', `/uid/${uid}/teams`, { passkey, team });
    }

    async getPasskey(email, user) {
        return this._request('PUT', '/passkey', { email, user });
    }

    async getBonusStatus(passkey = null, user = null) {
        return this._request('GET', '/bonus', { passkey, user });
    }

    async getUserCount() {
        return this._request('GET', '/user-count');
    }

    // --- TEAM ENDPOINTS ---

    async getTeams(query = null) {
        return this._request('GET', '/team', { q: query });
    }

    async getMonthlyTeams(month, year) {
        return this._request('GET', '/team/monthly', { month, year });
    }

    async findTeamByName(name) {
        return this._request('GET', '/team/find', { name });
    }

    async createTeam(data) {
        return this._request('POST', '/team/create', data);
    }

    async getTeamCount() {
        return this._request('GET', '/team/count');
    }

    async getTeamById(team) {
        return this._request('GET', `/team/${team}`);
    }

    async updateTeam(team, data = {}) {
        return this._request('PUT', `/team/${team}`, data);
    }

    async deleteTeam(team, password) {
        return this._request('DELETE', `/team/${team}`, { password });
    }

    async getTeamMembers(team) {
        return this._request('GET', `/team/${team}/members`);
    }

    async getTeamAccounts(team, count = null) {
        return this._request('GET', `/team/${team}/accounts`, { count });
    }

    async resetTeam(team, { code, password }) {
        return this._request('PUT', `/team/${team}/reset`, { code, password });
    }

    // --- STATS ENDPOINTS ---

    async getAssignmentServers() {
        return this._request('GET', '/as');
    }

    async getCpuData(query) {
        return this._request('GET', '/cpus', { query });
    }

    async getOsStats(days = '1') {
        return this._request('GET', '/os', { days });
    }

    async getCreditLog(count = null, start = null) {
        return this._request('GET', '/credit-log', { count, start });
    }

    // --- GPU ENDPOINTS ---

    async getGPUs() {
        return this._request('GET', '/gpus');
    }

    async getGpuByVendorAndDevice(vendor, device) {
        return this._request('GET', `/gpus/${vendor}/${device}`);
    }

    async updateGpu(vendor, device, data = {}) {
        return this._request('PUT', `/gpus/${vendor}/${device}`, data);
    }

    async deleteGpu(vendor, device) {
        return this._request('DELETE', `/gpus/${vendor}/${device}`);
    }

    // --- ACCOUNT ENDPOINTS ---

    async registerAccount(data) {
        return this._request('PUT', '/register', data);
    }

    async resetAccount(data) {
        return this._request('PUT', '/reset', data);
    }

    async resetAccountToken(token, data) {
        return this._request('PUT', `/reset/${token}`, data);
    }

    async verifyAccount(token) {
        return this._request('GET', `/verify/${token}`);
    }

    async login(data) {
        return this._request('GET', '/login', data);
    }

    async getAccount() {
        return this._request('GET', '/account');
    }

    async updateAccount(data) {
        return this._request('PUT', '/account', data);
    }

    async deleteAccount() {
        return this._request('DELETE', '/account');
    }

    async resetAccountToken() {
        return this._request('POST', '/account/token');
    }

    async setAccountSecret(data) {
        return this._request('PUT', '/account/secret', data);
    }

    async getAccountSecret(password) {
        return this._request('GET', '/account/secret', { password });
    }

    async updateMachine(id, name) {
        return this._request('PUT', `/account/machines/${id}`, { name });
    }

    async deleteMachine(id) {
        return this._request('DELETE', `/account/machines/${id}`);
    }

    async createAccountTeam(data) {
        return this._request('POST', '/account/teams', data);
    }

    async updateAccountTeam(team, data) {
        return this._request('PUT', `/account/teams/${team}`, data);
    }

    async deleteAccountTeam(team) {
        return this._request('DELETE', `/account/teams/${team}`);
    }

    async getMachine(id) {
        return this._request('GET', `/machine/${id}`);
    }

    async updateMachineData(id, data) {
        return this._request('PUT', `/machine/${id}`, data);
    }

    // --- PROJECT ENDPOINTS ---

    async getProjects() {
        return this._request('GET', '/project');
    }
}

module.exports = FoldingAtHomeAPI;