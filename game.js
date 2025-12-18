// ============================================
// TOWER DEFENSE GAME - Advanced Edition
// With Full Upgrade System & Ultimates
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas sizing
// Canvas sizing
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    if (!container) return;
    const size = Math.min(container.clientWidth, container.clientHeight);

    // Zoom Out Factor (Increase internal resolution to see more area)
    const zoomFactor = 1.6; // 60% larger world viewing area
    const newWidth = size * zoomFactor;
    const newHeight = size * zoomFactor;

    // Handle re-centering if game is running
    if (canvas.width > 0 && canvas.height > 0 && typeof tower !== 'undefined') {
        const dx = (newWidth - canvas.width) / 2;
        const dy = (newHeight - canvas.height) / 2;

        if (tower) { tower.x += dx; tower.y += dy; }
        if (typeof enemies !== 'undefined') enemies.forEach(e => { e.x += dx; e.y += dy; });
        if (typeof projectiles !== 'undefined') projectiles.forEach(p => { p.x += dx; p.y += dy; });
        if (typeof game !== 'undefined') {
            if (game.particles) game.particles.forEach(p => { p.x += dx; p.y += dy; });
            if (game.floatingTexts) game.floatingTexts.forEach(t => { t.x += dx; t.y += dy; });
        }
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resizeCanvas);
} else {
    resizeCanvas();
}
window.addEventListener('resize', resizeCanvas);

// ============================================
// UPGRADE DEFINITIONS
// ============================================
const upgradeDefinitions = {
    // ATTACK UPGRADES
    attack: {
        damage: {
            name: 'Damage', icon: '🔥',
            cost: 30, costMult: 1.3, effect: 3,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 50,
            desc: '+DMG'
        },
        attackSpeed: {
            name: 'Attack Speed', icon: '⚡',
            cost: 35, costMult: 1.35, effect: 5,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 30,
            desc: '+% rychlost'
        },
        critChance: {
            name: 'Crit Chance', icon: '💥',
            cost: 40, costMult: 1.4, effect: 3,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 25,
            desc: '+% crit'
        },
        critFactor: {
            name: 'Crit Factor', icon: '✨',
            cost: 50, costMult: 1.5, effect: 0.25,
            unlocked: false, unlockCost: 30, level: 0, maxLevel: 20,
            desc: '+x crit DMG'
        },
        range: {
            name: 'Range', icon: '🎯',
            cost: 35, costMult: 1.3, effect: 20,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 20,
            desc: '+dosah'
        },
        proximityDmg: {
            name: 'Proximity DMG', icon: '📍',
            cost: 60, costMult: 1.5, effect: 10,
            unlocked: false, unlockCost: 40, level: 0, maxLevel: 15,
            desc: '+% DMG za blízkost'
        },
        multishotChance: {
            name: 'Multishot', icon: '🔱',
            cost: 80, costMult: 1.6, effect: 5,
            unlocked: false, unlockCost: 50, level: 0, maxLevel: 15,
            desc: '+% šance'
        },
        multishotTargets: {
            name: 'Multi Targets', icon: '🎪',
            cost: 100, costMult: 1.8, effect: 1,
            unlocked: false, unlockCost: 75, level: 0, maxLevel: 5,
            desc: '+cílů'
        }
    },
    // DEFENSE UPGRADES
    defense: {
        health: {
            name: 'Health', icon: '❤️',
            cost: 40, costMult: 1.3, effect: 20,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 50,
            desc: '+HP'
        },
        healthRegen: {
            name: 'HP Regen', icon: '💚',
            cost: 50, costMult: 1.4, effect: 0.5,
            unlocked: false, unlockCost: 25, level: 0, maxLevel: 20,
            desc: '+HP/s'
        },
        defensePercent: {
            name: 'Defense %', icon: '🛡️',
            cost: 60, costMult: 1.45, effect: 3,
            unlocked: false, unlockCost: 35, level: 0, maxLevel: 25,
            desc: '+% redukce'
        },
        absoluteDefense: {
            name: 'Armor', icon: '🔰',
            cost: 70, costMult: 1.5, effect: 2,
            unlocked: false, unlockCost: 45, level: 0, maxLevel: 20,
            desc: '+flat redukce'
        },
        thornDamage: {
            name: 'Thorns', icon: '🌵',
            cost: 55, costMult: 1.4, effect: 5,
            unlocked: false, unlockCost: 40, level: 0, maxLevel: 20,
            desc: '+DMG zpět'
        },
        lifesteal: {
            name: 'Lifesteal', icon: '🩸',
            cost: 80, costMult: 1.6, effect: 2,
            unlocked: false, unlockCost: 60, level: 0, maxLevel: 15,
            desc: '+% DMG→HP'
        }
    },
    // UTILITY UPGRADES
    utility: {
        cashBonus: {
            name: 'Cash Bonus', icon: '💰',
            cost: 45, costMult: 1.35, effect: 5,
            unlocked: true, unlockCost: 0, level: 0, maxLevel: 25,
            desc: '+% zlata'
        },
        cashWave: {
            name: 'Wave Cash', icon: '🌊',
            cost: 60, costMult: 1.4, effect: 15,
            unlocked: false, unlockCost: 30, level: 0, maxLevel: 20,
            desc: '+zlato/vlna'
        },
        crystalBonus: {
            name: 'Crystal Bonus', icon: '💎',
            cost: 70, costMult: 1.5, effect: 5,
            unlocked: false, unlockCost: 35, level: 0, maxLevel: 20,
            desc: '+% krystalů'
        },
        crystalWave: {
            name: 'Wave Crystal', icon: '✨',
            cost: 80, costMult: 1.5, effect: 1,
            unlocked: false, unlockCost: 50, level: 0, maxLevel: 15,
            desc: '+krystal/vlna'
        },
        freeUpgrade: {
            name: 'Lucky', icon: '🍀',
            cost: 100, costMult: 1.8, effect: 3,
            unlocked: false, unlockCost: 75, level: 0, maxLevel: 10,
            desc: '+% free upgrade'
        }
    },
    special: {
        tesla: {
            name: 'Tesla Coil', icon: '⚡',
            cost: 500, costMult: 1.5, effect: 50, // Damage
            unlocked: false, unlockCost: 200, level: 0, maxLevel: 50,
            desc: 'Auto-zap damage'
        },
        missiles: {
            name: 'Swarm Missiles', icon: '🚀',
            cost: 800, costMult: 1.6, effect: 30, // Damage
            unlocked: false, unlockCost: 400, level: 0, maxLevel: 50,
            desc: 'Homing missiles'
        },
        nova: {
            name: 'Frost Nova', icon: '❄️',
            cost: 1000, costMult: 1.7, effect: 10, // Slow %
            unlocked: false, unlockCost: 600, level: 0, maxLevel: 30,
            desc: 'Area Slow/Freeze'
        },
        interest: {
            name: 'Interest', icon: '🏦',
            cost: 2000, costMult: 2.0, effect: 1, // 1% per level
            unlocked: false, unlockCost: 1000, level: 0, maxLevel: 10,
            desc: '% cash per wave'
        }
    }
};

// ULTIMATE ABILITIES
const ultimates = {
    meteor: {
        name: 'Meteor Strike', icon: '☄️',
        unlocked: false, unlockCost: 100,
        cooldown: 1800, currentCooldown: 0, // 30 seconds
        desc: 'Massive AOE damage'
    },
    shield: {
        name: 'Shield Dome', icon: '🔮',
        unlocked: false, unlockCost: 100,
        cooldown: 2400, currentCooldown: 0, // 40 seconds
        duration: 300, active: false, // 5 seconds
        desc: '5s immunity'
    },
    overdrive: {
        name: 'Overdrive', icon: '⚡',
        unlocked: false, unlockCost: 75,
        cooldown: 1200, currentCooldown: 0, // 20 seconds
        duration: 600, active: false, // 10 seconds
        desc: '2x attack speed'
    },
    goldRush: {
        name: 'Gold Rush', icon: '🤑',
        unlocked: false, unlockCost: 50,
        cooldown: 1800, currentCooldown: 0, // 30 seconds
        duration: 1800, active: false, // 30 seconds
        desc: '3x cash'
    }
};
// PERMANENT UPGRADES (persist forever, bought with crystals)
const permanentUpgrades = {
    attack: {
        baseDamage: { name: 'Base DMG', icon: '🔥', level: 0, cost: 15, costMult: 1.5, effect: 2, maxLevel: 25 },
        baseSpeed: { name: 'Base Speed', icon: '⚡', level: 0, cost: 15, costMult: 1.5, effect: 3, maxLevel: 20 },
        baseCrit: { name: 'Base Crit', icon: '💥', level: 0, cost: 20, costMult: 1.6, effect: 2, maxLevel: 15 },
        baseRange: { name: 'Base Range', icon: '🎯', level: 0, cost: 12, costMult: 1.4, effect: 15, maxLevel: 20 },
        multishotChance: { name: 'Multishot %', icon: '🔱', level: 0, cost: 50, costMult: 1.8, effect: 5, maxLevel: 10 },
        multishotTargets: { name: 'Extra Target', icon: '🏹', level: 0, cost: 100, costMult: 2.0, effect: 1, maxLevel: 5 }
    },
    defense: {
        baseHealth: { name: 'Base HP', icon: '❤️', level: 0, cost: 15, costMult: 1.5, effect: 15, maxLevel: 25 },
        baseRegen: { name: 'Base Regen', icon: '💚', level: 0, cost: 25, costMult: 1.7, effect: 0.3, maxLevel: 15 },
        baseDefense: { name: 'Base Armor', icon: '🛡️', level: 0, cost: 20, costMult: 1.6, effect: 2, maxLevel: 15 }
    },
    utility: {
        startMoney: { name: 'Start Cash', icon: '💰', level: 0, cost: 10, costMult: 1.4, effect: 25, maxLevel: 20 },
        cashBonus: { name: 'Cash Mult', icon: '💵', level: 0, cost: 18, costMult: 1.5, effect: 5, maxLevel: 15 },
        crystalBonus: { name: 'Crystal Mult', icon: '💎', level: 0, cost: 25, costMult: 1.7, effect: 10, maxLevel: 10 },
        baseLuck: { name: 'Base Luck', icon: '🍀', level: 0, cost: 50, costMult: 1.5, effect: 5, maxLevel: 20 }
    }
};

let totalCrystals = 0;
let currentTab = 'attack';
let currentPermTab = 'attack';

// Game speed control
let gameSpeed = 1;
const speedOptions = [1, 2, 5, 10, 50, 100, 500, 1000, 100000, 10000000, 100000000000, 100000000000000000, 100000000000000000000000];
let speedIndex = 0;
let gameTimeBank = 0;

function cycleSpeed() {
    speedIndex = (speedIndex + 1) % speedOptions.length;
    gameSpeed = speedOptions[speedIndex];
    const btn = document.getElementById('speedBtn');
    if (btn) {
        btn.querySelector('#speedText').textContent = gameSpeed + 'x';
        btn.style.borderColor = gameSpeed > 1 ? '#00ffff' : 'rgba(0, 255, 255, 0.5)';
        btn.style.boxShadow = gameSpeed > 1 ? '0 0 15px rgba(0, 255, 255, 0.3)' : 'none';

        // Update particles color for visual feedback
        game.floatingTexts.push(new FloatingText(
            canvas.width / 2, canvas.height / 3,
            `⏩ SPEED ${gameSpeed}x`, '#00ffff'
        ));
    }
}

// ============================================
// SAVE/LOAD SYSTEM
// ============================================
function loadProgress() {
    try {
        const saved = localStorage.getItem('towerDefenseAdvanced');
        if (saved) {
            const data = JSON.parse(saved);
            totalCrystals = data.crystals || 0;

            // Load in-game upgrade unlocks
            if (data.upgrades) {
                for (const cat in data.upgrades) {
                    if (upgradeDefinitions[cat]) {
                        for (const key in data.upgrades[cat]) {
                            if (upgradeDefinitions[cat][key]) {
                                upgradeDefinitions[cat][key].unlocked = data.upgrades[cat][key].unlocked || upgradeDefinitions[cat][key].unlocked;
                            }
                        }
                    }
                }
            }

            // Load permanent upgrades
            if (data.permanentUpgrades) {
                for (const cat in data.permanentUpgrades) {
                    if (permanentUpgrades[cat]) {
                        for (const key in data.permanentUpgrades[cat]) {
                            if (permanentUpgrades[cat][key]) {
                                permanentUpgrades[cat][key].level = data.permanentUpgrades[cat][key].level || 0;
                            }
                        }
                    }
                }
            }

            // Load ultimates
            if (data.ultimates) {
                for (const key in data.ultimates) {
                    if (ultimates[key]) {
                        ultimates[key].unlocked = data.ultimates[key].unlocked || false;
                    }
                }
            }
        }
    } catch (e) {
        console.log('Could not load progress');
    }
    updateCrystalsDisplay();
}

function saveProgress() {
    try {
        const data = {
            crystals: totalCrystals,
            upgrades: {},
            permanentUpgrades: {},
            ultimates: {}
        };

        // Save in-game upgrade unlocks only
        for (const cat in upgradeDefinitions) {
            data.upgrades[cat] = {};
            for (const key in upgradeDefinitions[cat]) {
                data.upgrades[cat][key] = {
                    unlocked: upgradeDefinitions[cat][key].unlocked
                };
            }
        }

        // Save permanent upgrades
        for (const cat in permanentUpgrades) {
            data.permanentUpgrades[cat] = {};
            for (const key in permanentUpgrades[cat]) {
                data.permanentUpgrades[cat][key] = {
                    level: permanentUpgrades[cat][key].level
                };
            }
        }

        for (const key in ultimates) {
            data.ultimates[key] = { unlocked: ultimates[key].unlocked };
        }

        localStorage.setItem('towerDefenseAdvanced', JSON.stringify(data));
    } catch (e) {
        console.log('Could not save progress');
    }
}

function checkLuckyUpgrade() {
    const chance = getFreeUpgradeChance();
    if (chance <= 0) return;

    if (Math.random() * 100 < chance) {
        const candidates = [];
        for (const cat in upgradeDefinitions) {
            for (const key in upgradeDefinitions[cat]) {
                const u = upgradeDefinitions[cat][key];
                // Must be not maxed AND (unlocked is undefined/true OR basic property check)
                // Assuming basic upgrades don't have 'unlocked: false' property or handled properly.
                if (u.level < u.maxLevel && u.unlocked !== false) {
                    candidates.push({ def: u, cat: cat, key: key });
                }
            }
        }

        if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            pick.def.level++;

            // Handle Health special case (heal on upgrade)
            if (pick.cat === 'defense' && pick.key === 'health') {
                const oldMax = tower.maxHealth;
                tower.maxHealth = getMaxHealth();
                tower.health += (tower.maxHealth - oldMax);
                tower.updateHealthUI();
            }

            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2 - 50,
                `🍀 LUCKY! +1 ${pick.def.name}`, '#00ff00'
            ));

            updateUI();
            saveProgress();
        }
    }
}

function updateCrystalsDisplay() {
    const el = document.getElementById('crystals');
    if (el) el.textContent = totalCrystals;
    const el2 = document.getElementById('totalCrystals');
    if (el2) el2.textContent = totalCrystals;
}

// ============================================
// PERMANENT UPGRADE FUNCTIONS
// ============================================
function getPermUpgradeValue(category, key) {
    return permanentUpgrades[category][key].level * permanentUpgrades[category][key].effect;
}

function buyPermUpgrade(category, key) {
    const upg = permanentUpgrades[category][key];
    const cost = Math.round(upg.cost * Math.pow(upg.costMult, upg.level));

    if (totalCrystals >= cost && upg.level < upg.maxLevel) {
        totalCrystals -= cost;
        upg.level++;
        saveProgress();
        updateCrystalsDisplay();
        renderPermUpgrades();
    }
}

function renderPermUpgrades() {
    const panel = document.getElementById('permContent');
    if (!panel) return;

    const upgrades = permanentUpgrades[currentPermTab];
    let html = '';

    for (const key in upgrades) {
        const upg = upgrades[key];
        const cost = Math.round(upg.cost * Math.pow(upg.costMult, upg.level));
        const canAfford = totalCrystals >= cost;
        const isMaxed = upg.level >= upg.maxLevel;

        html += `<button class="perm-btn ${!canAfford || isMaxed ? 'disabled' : ''}" 
            onclick="buyPermUpgrade('${currentPermTab}', '${key}')" ${!canAfford || isMaxed ? 'disabled' : ''}>
            <span class="perm-icon">${upg.icon}</span>
            <span class="perm-name">${upg.name}</span>
            <span class="perm-level">Lv.${upg.level}${isMaxed ? ' MAX' : ''}</span>
            <span class="perm-cost">${isMaxed ? '-' : cost + '💎'}</span>
        </button>`;
    }

    panel.innerHTML = html;
}

function switchPermTab(tab) {
    currentPermTab = tab;
    document.querySelectorAll('.perm-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-permtab="${tab}"]`).classList.add('active');
    renderPermUpgrades();
}

// ============================================
// GET UPGRADE VALUES
// ============================================
function getUpgradeValue(category, key) {
    const upg = upgradeDefinitions[category][key];
    return upg.level * upg.effect;
}

function getTotalDamage() {
    const base = 10 + getPermUpgradeValue('attack', 'baseDamage');
    return base + getUpgradeValue('attack', 'damage');
}

function getAttackSpeed() {
    const baseRate = 60;
    const permBonus = getPermUpgradeValue('attack', 'baseSpeed');
    const bonus = getUpgradeValue('attack', 'attackSpeed') + permBonus;
    let rate = baseRate * (1 - bonus / 100);
    if (ultimates.overdrive.active) rate *= 0.5;
    return Math.max(10, rate);
}

function getCritChance() {
    return getPermUpgradeValue('attack', 'baseCrit') + getUpgradeValue('attack', 'critChance');
}

function getCritFactor() {
    return 2 + getUpgradeValue('attack', 'critFactor');
}

function getRange() {
    const base = 200 + getPermUpgradeValue('attack', 'baseRange');
    return base + getUpgradeValue('attack', 'range');
}

function getProximityBonus() {
    return getUpgradeValue('attack', 'proximityDmg');
}

function getMultishotChance() {
    return getUpgradeValue('attack', 'multishotChance') + getPermUpgradeValue('attack', 'multishotChance');
}

function getMultishotTargets() {
    return 2 + getUpgradeValue('attack', 'multishotTargets') + getPermUpgradeValue('attack', 'multishotTargets');
}

function getMaxHealth() {
    const base = 100 + getPermUpgradeValue('defense', 'baseHealth');
    return base + getUpgradeValue('defense', 'health');
}

function getHealthRegen() {
    return getPermUpgradeValue('defense', 'baseRegen') + getUpgradeValue('defense', 'healthRegen');
}

function getDefensePercent() {
    return Math.min(75, getUpgradeValue('defense', 'defensePercent'));
}

function getAbsoluteDefense() {
    return getPermUpgradeValue('defense', 'baseDefense') + getUpgradeValue('defense', 'absoluteDefense');
}

function getThornDamage() {
    return getUpgradeValue('defense', 'thornDamage');
}

function getLifesteal() {
    return getUpgradeValue('defense', 'lifesteal');
}

function getCashBonus() {
    const permBonus = getPermUpgradeValue('utility', 'cashBonus');
    let bonus = 1 + (getUpgradeValue('utility', 'cashBonus') + permBonus) / 100;
    if (ultimates.goldRush.active) bonus *= 3;
    return bonus;
}

function getWaveCashBonus() {
    return 50 + getUpgradeValue('utility', 'cashWave');
}

function getCrystalBonus() {
    const permBonus = getPermUpgradeValue('utility', 'crystalBonus');
    return 1 + (getUpgradeValue('utility', 'crystalBonus') + permBonus) / 100;
}

function getWaveCrystalBonus() {
    return getUpgradeValue('utility', 'crystalWave');
}

function getFreeUpgradeChance() {
    return getPermUpgradeValue('utility', 'baseLuck') + getUpgradeValue('utility', 'freeUpgrade');
}

function getStartMoney() {
    return 100 + getPermUpgradeValue('utility', 'startMoney');
}

// ============================================
// GAME STATE
// ============================================
const game = {
    running: false,
    money: 100,
    score: 0,
    wave: 1,
    enemiesKilled: 0,
    enemiesPerWave: 5,
    spawnTimer: 0,
    spawnDelay: 120,
    waveDelay: 180,
    waveTimer: 0,
    particles: [],
    effects: [], // New Visual Effects
    floatingTexts: [],
    rushMode: false, // Auto-Rush State

    // Specials State
    specials: {
        teslaCD: 0,
        missileCD: 0,
        novaCD: 0
    }
};

// ============================================
// TOWER CLASS
// ============================================
class Tower {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 40;
        this.maxHealth = getMaxHealth();
        this.health = this.maxHealth;
        this.fireTimer = 0;
        this.rotation = 0;
        this.targetAngle = 0;
        this.regenTimer = 0;
    }

    update(enemies) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        // Health regeneration
        this.regenTimer++;
        if (this.regenTimer >= 60) {
            const regen = getHealthRegen();
            if (regen > 0 && this.health < this.maxHealth) {
                this.health = Math.min(this.maxHealth, this.health + regen);
                updateStats();
            }
            this.regenTimer = 0;
        }

        // Find enemies in range
        const range = getRange();
        let targetsInRange = [];

        for (const enemy of enemies) {
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < range) {
                targetsInRange.push({ enemy, dist });
            }
        }

        targetsInRange.sort((a, b) => a.dist - b.dist);

        if (targetsInRange.length > 0) {
            this.targetAngle = Math.atan2(
                targetsInRange[0].enemy.y - this.y,
                targetsInRange[0].enemy.x - this.x
            );
        } else {
            // Idle spin if no target
            this.targetAngle += 0.02;
        }

        // Smooth Rotation Logic
        let diff = this.targetAngle - this.rotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.rotation += diff * 0.1; // 10% interpolation speed

        // Fire
        this.fireTimer--;
        if (targetsInRange.length > 0 && this.fireTimer <= 0) {
            const multishotChance = getMultishotChance();
            const isMultishot = Math.random() * 100 < multishotChance;
            const numTargets = isMultishot ? Math.min(getMultishotTargets(), targetsInRange.length) : 1;

            for (let i = 0; i < numTargets; i++) {
                this.fire(targetsInRange[i].enemy, targetsInRange[i].dist);
            }

            this.fireTimer = getAttackSpeed();
        }
    }

    fire(target, distance) {
        const angle = Math.atan2(target.y - this.y, target.x - this.x);

        // Calculate damage
        let damage = getTotalDamage();

        // Proximity bonus
        const proxBonus = getProximityBonus();
        if (proxBonus > 0) {
            const maxDist = getRange();
            const proximityMult = 1 + (proxBonus / 100) * (1 - distance / maxDist);
            damage *= proximityMult;
        }

        // Critical hit
        let isCrit = false;
        if (Math.random() * 100 < getCritChance()) {
            damage *= getCritFactor();
            isCrit = true;
        }

        damage = Math.round(damage);

        projectiles.push(new Projectile(
            this.x + Math.cos(angle) * this.radius,
            this.y + Math.sin(angle) * this.radius,
            angle,
            damage,
            isCrit
        ));

        const flashColor = isCrit ? '#ffff00' : '#00c8ff';
        for (let i = 0; i < 5; i++) {
            game.particles.push(new Particle(
                this.x + Math.cos(angle) * this.radius,
                this.y + Math.sin(angle) * this.radius,
                angle + (Math.random() - 0.5) * 0.5,
                flashColor,
                15
            ));
        }
    }

    takeDamage(amount) {
        if (ultimates.shield.active) return;

        // Apply defenses
        let dmg = amount;
        dmg -= getAbsoluteDefense();
        dmg *= (1 - getDefensePercent() / 100);
        dmg = Math.max(1, dmg);

        this.health -= dmg;

        for (let i = 0; i < 8; i++) {
            game.particles.push(new Particle(
                this.x + (Math.random() - 0.5) * this.radius,
                this.y + (Math.random() - 0.5) * this.radius,
                Math.random() * Math.PI * 2,
                '#ff4444',
                20
            ));
        }

        this.updateHealthUI();
        updateStats();

        if (this.health <= 0) {
            gameOver();
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthUI();
        updateStats();
    }

    updateHealthUI() {
        const healthBar = document.getElementById('healthBar');
        const healthText = document.getElementById('healthText');
        const percent = (this.health / this.maxHealth) * 100;
        healthBar.style.width = percent + '%';

        if (percent > 60) {
            healthBar.style.background = 'linear-gradient(90deg, #00ff64, #64ff00)';
        } else if (percent > 30) {
            healthBar.style.background = 'linear-gradient(90deg, #ffcc00, #ff8800)';
        } else {
            healthBar.style.background = 'linear-gradient(90deg, #ff4444, #ff0000)';
        }

        healthText.textContent = `${Math.ceil(this.health)}/${this.maxHealth}`;
    }

    draw() {
        const x = this.x;
        const y = this.y;

        // Range indicator
        ctx.beginPath();
        ctx.arc(x, y, getRange(), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Shield effect
        if (ultimates.shield.active) {
            ctx.beginPath();
            ctx.arc(x, y, this.radius + 20, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.fill();
        }

        ctx.shadowBlur = 30;
        ctx.shadowColor = ultimates.overdrive.active ? '#ffff00' : '#00c8ff';

        // Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = this.rotation + (i * Math.PI * 2 / 6);
            const px = x + Math.cos(angle) * this.radius;
            const py = y + Math.sin(angle) * this.radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
        gradient.addColorStop(0, 'rgba(0, 100, 150, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 50, 80, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = ultimates.overdrive.active ? '#ffff00' : '#00c8ff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = -this.rotation + (i * Math.PI * 2 / 6);
            const px = x + Math.cos(angle) * (this.radius * 0.5);
            const py = y + Math.sin(angle) * (this.radius * 0.5);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gun
        const gunLength = this.radius + 15;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(this.rotation) * gunLength,
            y + Math.sin(this.rotation) * gunLength
        );
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.shadowBlur = 0;
    }
}

// ============================================
// ENEMY CLASS
// ============================================
class Enemy {
    constructor(type = 'normal') {
        const side = Math.floor(Math.random() * 4);
        const margin = 50;

        switch (side) {
            case 0: this.x = Math.random() * canvas.width; this.y = -margin; break;
            case 1: this.x = canvas.width + margin; this.y = Math.random() * canvas.height; break;
            case 2: this.x = Math.random() * canvas.width; this.y = canvas.height + margin; break;
            case 3: this.x = -margin; this.y = Math.random() * canvas.height; break;
        }

        this.type = type;
        this.setTypeStats();
        this.attackTimer = 0;
    }

    setTypeStats() {
        switch (this.type) {
            case 'fast':
                this.radius = 12; this.health = 15; this.speed = 2.5;
                this.baseDamage = 5; this.color = '#ffff00';
                this.glowColor = 'rgba(255, 255, 0, 0.5)'; this.value = 8;
                break;
            case 'tank':
                this.radius = 25; this.health = 80; this.speed = 0.6;
                this.baseDamage = 20; this.color = '#ff00ff';
                this.glowColor = 'rgba(255, 0, 255, 0.5)'; this.value = 25;
                break;
            case 'boss':
                this.radius = 40; this.health = 150; this.speed = 0.35;
                this.baseDamage = 40; this.color = '#ff0000';
                this.glowColor = 'rgba(255, 0, 0, 0.5)'; this.value = 100;
                break;
            case 'elite': // Wave 50+
                this.radius = 20; this.health = 300; this.speed = 1.2;
                this.baseDamage = 50; this.color = '#00ffff';
                this.glowColor = 'rgba(0, 255, 255, 0.5)'; this.value = 50;
                break;
            case 'titan': // Wave 100+
                this.radius = 35; this.health = 1000; this.speed = 0.3;
                this.baseDamage = 150; this.color = '#ffffff';
                this.glowColor = 'rgba(255, 255, 255, 0.5)'; this.value = 200;
                break;
            case 'protector': // Wave 200+
                this.radius = 28; this.health = 500; this.speed = 0.5;
                this.baseDamage = 20; this.color = '#00ff00';
                this.glowColor = 'rgba(0, 255, 0, 0.5)'; this.value = 150;
                break;
            case 'vampire': // Wave 300+
                this.radius = 18; this.health = 250; this.speed = 1.1;
                this.baseDamage = 40; this.color = '#ff0055';
                this.glowColor = 'rgba(255, 0, 85, 0.5)'; this.value = 100;
                break;
            case 'scatter': // Wave 400+
                this.radius = 12; this.health = 100; this.speed = 3.0;
                this.baseDamage = 30; this.color = '#aa00ff';
                this.glowColor = 'rgba(170, 0, 255, 0.5)'; this.value = 120;
                break;
            case 'ray': // Wave 500+
                this.radius = 20; this.health = 400; this.speed = 0.9;
                this.baseDamage = 200; this.color = '#ffaa00';
                this.glowColor = 'rgba(255, 170, 0, 0.5)'; this.value = 300;
                break;
            default:
                this.radius = 15; this.health = 30; this.speed = 1;
                this.baseDamage = 10; this.color = '#ff6464';
                this.glowColor = 'rgba(255, 100, 100, 0.5)'; this.value = 10;
        }
        this.baseSpeed = this.speed; // Store initial speed for status effects

        // Scale with wave & Tier
        const tier = Math.floor(game.wave / 100);
        const tierMult = 1 + (tier * 0.5); // +50% extra stats every 100 waves

        const waveScale = (1 + (game.wave - 1) * 0.08) * tierMult;
        this.health *= waveScale;
        this.maxHealth = this.health;

        // Enemy damage scaling
        const dmgScale = (1 + (game.wave - 1) * 0.03) * tierMult;
        this.damage = Math.round(this.baseDamage * dmgScale);
    }

    update() {
        // Status Effects Logic
        if (this.baseSpeed !== undefined) {
            this.speed = this.baseSpeed;
            if (this.slowTimer > 0) {
                this.speed *= 0.5;
                this.slowTimer--;
            }
        } else {
            this.baseSpeed = this.speed; // Init for legacy entities
        }

        const dx = tower.x - this.x;
        const dy = tower.y - this.y;
        const distSq = dx * dx + dy * dy;
        const combinedRadius = tower.radius + this.radius;
        // Fix: Add buffer (epsilon) to prevent oscillation at boundary
        const attackRangeSq = (combinedRadius + 2) * (combinedRadius + 2);

        // Optimization: Avoid Sqrt if far away
        if (distSq < attackRangeSq) {
            // At tower boundary - force position to edge
            const dist = Math.sqrt(distSq);
            if (dist > 0) { // Avoid div by zero
                const factor = combinedRadius / dist;
                // Force to radius (using original formula)
                this.x = tower.x - dx * (factor - 1); // This sets dist to combinedRadius
                // After this, distSq == combinedRadius^2. 
                // Next frame distSq < (combinedRadius+2)^2 is TRUE. 
                // So we stay in Attack Block. Oscillation Fixed.

                // Keep correct position (radius)
                this.x = tower.x - (dx / dist) * combinedRadius;
                this.y = tower.y - (dy / dist) * combinedRadius;
            }

            this.attackTimer++;
            if (this.attackTimer >= 60) {
                tower.takeDamage(this.damage);

                // Thorn damage
                const thorns = getThornDamage();
                if (thorns > 0) {
                    this.takeDamage(thorns, false);
                }

                this.attackTimer = 0;
            }
        } else {
            // Move Logic (Optimization: No atan2)
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
                // Vector E->T is (dx, dy).
                // Move towards tower: x += (dx/dist) * speed.
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }
    }

    takeDamage(amount, applyLifesteal = true) {
        this.health -= amount;

        for (let i = 0; i < 3; i++) {
            game.particles.push(new Particle(
                this.x, this.y,
                Math.random() * Math.PI * 2,
                this.color, 10
            ));
        }

        // Lifesteal
        if (applyLifesteal && this.health > 0) {
            const ls = getLifesteal();
            if (ls > 0) {
                tower.heal(amount * ls / 100);
            }
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        const cashValue = Math.round(this.value * getCashBonus());
        game.score += this.value;
        game.money += cashValue;
        game.enemiesKilled++;

        for (let i = 0; i < 15; i++) {
            game.particles.push(new Particle(
                this.x, this.y,
                Math.random() * Math.PI * 2,
                this.color, 25
            ));
        }

        game.floatingTexts.push(new FloatingText(
            this.x, this.y, '+' + cashValue + '💰', '#ffd700'
        ));

        updateUI();
    }

    draw() {
        // Optimization: Disable expensive effects if too many enemies
        const simpleMode = enemies.length > 300;

        if (!simpleMode) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.glowColor;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!simpleMode) {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
        }

        if (!simpleMode) ctx.shadowBlur = 0;

        if (this.health < this.maxHealth) {
            const barWidth = this.radius * 2;
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 10, barWidth, 4);
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff64' : healthPercent > 0.25 ? '#ffcc00' : '#ff4444';
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 10, barWidth * healthPercent, 4);
        }

        ctx.shadowBlur = 0;
    }
}

// ============================================
// PROJECTILE CLASS
// ============================================
class Projectile {
    constructor(x, y, angle, damage, isCrit = false, type = 'normal', target = null) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type; // 'normal' or 'missile'
        this.target = target;
        this.speed = type === 'missile' ? 8 : 10;
        this.radius = isCrit ? 6 : (type === 'missile' ? 5 : 4);
        this.damage = damage;
        this.isCrit = isCrit;
        this.lifetime = 100;
        if (type === 'missile') this.lifetime = 150;
    }

    update() {
        if (this.type === 'missile') {
            // Rocket Trail
            if (Math.random() < 0.5) {
                game.particles.push(new Particle(this.x, this.y, this.angle + Math.PI, '#ffaa00', 4));
            }
        }

        if (this.type === 'missile' && this.target) {
            if (this.target.health <= 0) {
                this.target = null;
            } else {
                const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
                // Simple steering
                this.angle = targetAngle;
            }
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.lifetime--;

        if (Math.random() < 0.3) {
            game.particles.push(new Particle(
                this.x, this.y, this.angle + Math.PI,
                this.isCrit ? '#ffff00' : '#00c8ff', 8
            ));
        }
    }

    draw() {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.isCrit ? '#ffff00' : '#00ffff';

        if (this.type === 'missile') {
            // Rocket body
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            // Tail
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * 12,
                this.y - Math.sin(this.angle) * 12
            );
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 4;
            ctx.stroke();
        } else {
            // Normal projectile
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isCrit ? '#ffff00' : '#00ffff';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * 15,
                this.y - Math.sin(this.angle) * 15
            );
            ctx.strokeStyle = this.isCrit ? 'rgba(255, 255, 0, 0.5)' : 'rgba(0, 200, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
    }
}

// ============================================
// VISUAL EFFECTS
// ============================================
class VisualEffect {
    constructor(type, x, y, data) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.data = data; // { targetX, targetY, radius, maxRadius, color, width }
        this.lifetime = data.lifetime || 30;
        this.maxLifetime = this.lifetime;
    }

    update() {
        this.lifetime--;
        if (this.type === 'nova') {
            this.data.radius += 5; // Expand faster
        }
    }

    draw() {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.globalAlpha = alpha;

        if (this.type === 'lightning') {
            const { targetX, targetY, color, width } = this.data;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            // Jagged line
            const dist = Math.hypot(targetX - this.x, targetY - this.y);
            const steps = Math.floor(dist / 20);
            let cx = this.x;
            let cy = this.y;

            for (let i = 1; i < steps; i++) {
                const prog = i / steps;
                const tx = this.x + (targetX - this.x) * prog;
                const ty = this.y + (targetY - this.y) * prog;
                const jitter = (Math.random() - 0.5) * 20;
                ctx.lineTo(tx + jitter, ty + jitter);
                cx = tx; cy = ty;
            }
            ctx.lineTo(targetX, targetY);

            ctx.strokeStyle = color || '#ffff00';
            ctx.lineWidth = width || 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else if (this.type === 'nova') {
            const { color, radius } = this.data;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = color || '#00ffff';
            ctx.lineWidth = 4;
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha * 0.2;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
    }
}

// ============================================
// PARTICLE & FLOATING TEXT
// ============================================
class Particle {
    constructor(x, y, angle, color, lifetime) {
        this.x = x; this.y = y; this.angle = angle;
        this.speed = 1 + Math.random() * 3;
        this.color = color;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.radius = 2 + Math.random() * 3;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.95;
        this.lifetime--;
    }
    draw() {
        ctx.globalAlpha = this.lifetime / this.maxLifetime;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (this.lifetime / this.maxLifetime), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class FloatingText {
    constructor(x, y, text, color) {
        this.x = x; this.y = y; this.text = text;
        this.color = color; this.lifetime = 60; this.maxLifetime = 60;
    }
    update() { this.y -= 1; this.lifetime--; }
    draw() {
        ctx.globalAlpha = this.lifetime / this.maxLifetime;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

// ============================================
// GAME OBJECTS
// ============================================
let tower = new Tower();
let enemies = [];
let projectiles = [];

// ============================================
// SPAWNING & WAVES
// ============================================
function spawnEnemy() {
    let type = 'normal';
    const rand = Math.random();

    // Tiered Enemies (Highest wave priority first)
    if (game.wave >= 500 && rand < 0.05) type = 'ray';
    else if (game.wave >= 400 && rand < 0.05) type = 'scatter';
    else if (game.wave >= 300 && rand < 0.08) type = 'vampire';
    else if (game.wave >= 200 && rand < 0.1) type = 'protector';
    else if (game.wave >= 100 && rand < 0.05) type = 'titan';

    else if (game.wave >= 50 && rand < 0.1) type = 'elite';
    else if (game.wave >= 5 && rand < 0.1) type = 'tank';
    else if (game.wave >= 3 && rand < 0.2) type = 'fast';

    enemies.push(new Enemy(type));
}

function spawnBoss() {
    enemies.push(new Enemy('boss'));
}

function startWave() {
    game.enemiesKilled = 0;
    // Scale: Base 10 + 8 per wave (was 2). 
    // Wave 10: 90 enemies. Wave 100: 810 enemies.
    game.enemiesPerWave = 10 + Math.ceil(game.wave * 8);
    game.enemiesToSpawn = game.enemiesPerWave;

    // Constant Duration Logic: Spawn everything in ~30 seconds (1800 frames)
    const targetFrames = 1800; // 30s
    // Delay = Frames / Enemies. Min 1 frame.
    const calcDelay = Math.floor(targetFrames / game.enemiesPerWave);
    game.spawnDelay = Math.max(1, Math.min(60, calcDelay));

    if (game.wave % 5 === 0) spawnBoss();
    updateUI();
}

function completeWave() {
    // Wave bonus
    const waveBonus = Math.round(getWaveCashBonus() * game.wave);
    game.money += waveBonus;

    // Continuous Crystals Logic
    const earnedTotal = Math.floor((game.wave + game.score / 100) * getCrystalBonus());
    const newCrystals = Math.max(0, earnedTotal - (game.crystalsGivenThisGame || 0));

    // Extra Wave Crystal Bonus
    const waveCrystalBonus = getWaveCrystalBonus();

    let totalGainedNow = 0;

    if (newCrystals > 0) {
        totalCrystals += newCrystals;
        game.crystalsGivenThisGame = (game.crystalsGivenThisGame || 0) + newCrystals;
        totalGainedNow += newCrystals;
    }

    if (waveCrystalBonus > 0) {
        totalCrystals += waveCrystalBonus;
        totalGainedNow += waveCrystalBonus;
    }

    // Interest Logic
    const interestLevel = getUpgradeValue('special', 'interest');
    if (interestLevel > 0) {
        const interest = Math.floor(game.money * (interestLevel * 0.01));
        const maxInterest = 1000 * Math.pow(1.5, interestLevel); // Cap to prevent infinite scaling
        const pay = Math.min(interest, maxInterest);
        if (pay > 0) {
            game.money += pay;
            totalGainedNow += pay;
            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2 - 90,
                `🏦 INTEREST +${pay}💰`, '#ffd700'
            ));
        }
    }

    if (totalGainedNow > 0) saveProgress();

    // Check for Lucky (Free) Upgrade
    checkLuckyUpgrade();

    game.floatingTexts.push(new FloatingText(
        canvas.width / 2, canvas.height / 2 - 60,
        '🌊 VLNA ' + game.wave + ' +' + waveBonus + '💰',
        '#64c8ff'
    ));

    if (totalGainedNow > 0) {
        game.floatingTexts.push(new FloatingText(
            canvas.width / 2, canvas.height / 2 - 30,
            '+' + totalGainedNow + '💎',
            '#b464ff'
        ));
    }

    updateCrystalsDisplay();
}

// ============================================
// COLLISION
// ============================================
function checkCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        const r = proj.radius;
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = proj.x - enemy.x;
            const dy = proj.y - enemy.y;
            // Optimization: DistSquared check avoids Sqrt
            if (dx * dx + dy * dy < (r + enemy.radius) * (r + enemy.radius)) {
                enemy.takeDamage(proj.damage);
                projectiles.splice(i, 1);
                break;
            }
        }
    }
}

// ============================================
// UI UPDATES
// ============================================
function updateSpecials() {
    // Tesla Coil (Auto Zap)
    const teslaLvl = getUpgradeValue('special', 'tesla');
    if (teslaLvl > 0) {
        if (game.specials.teslaCD > 0) game.specials.teslaCD--;
        else {
            // Find random target
            const validTargets = enemies.filter(e => Math.hypot(e.x - tower.x, e.y - tower.y) < getRange());
            if (validTargets.length > 0) {
                const target = validTargets[Math.floor(Math.random() * validTargets.length)];
                const dmg = Math.floor(50 * (1 + teslaLvl * 0.2));
                target.takeDamage(dmg);
                // Visual
                game.effects.push(new VisualEffect('lightning', tower.x, tower.y, {
                    targetX: target.x, targetY: target.y, color: '#ffff00', width: 3, lifetime: 8
                }));
                game.particles.push(new Particle(target.x, target.y, 0, '#ffff00', 10));
                game.floatingTexts.push(new FloatingText(target.x, target.y - 20, '⚡' + dmg, '#ffff00'));

                game.specials.teslaCD = Math.max(10, 120 - teslaLvl * 2);
            }
        }
    }

    // Swarm Missiles
    const missileLvl = getUpgradeValue('special', 'missiles');
    if (missileLvl > 0) {
        if (game.specials.missileCD > 0) game.specials.missileCD--;
        else {
            const dmg = Math.floor(30 * (1 + missileLvl * 0.25));
            // Fire 1 + lvl/10 missiles
            const count = 1 + Math.floor(missileLvl / 10);
            const targets = enemies.length > 0 ? enemies : null;

            if (targets) {
                for (let i = 0; i < count; i++) {
                    const target = targets[Math.floor(Math.random() * targets.length)];
                    const angle = (Math.random() * Math.PI * 2);
                    projectiles.push(new Projectile(
                        tower.x, tower.y, angle, dmg, false, 'missile', target
                    ));
                }
                game.specials.missileCD = Math.max(30, 200 - missileLvl * 3);
            }
        }
    }

    // Frost Nova
    const novaLvl = getUpgradeValue('special', 'nova');
    if (novaLvl > 0) {
        if (game.specials.novaCD > 0) game.specials.novaCD--;
        else {
            // Apply slow
            let hit = false;
            const range = getRange() * 0.8;
            enemies.forEach(e => {
                const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                if (dist < range) {
                    // Fix: Use Status Effect instead of permanent multiplication
                    e.slowTimer = 180; // Slow for 3 seconds (60fps)

                    const dmg = Math.floor(10 * (1 + novaLvl * 0.3));
                    e.takeDamage(dmg);
                    hit = true;
                }
            });

            if (hit || enemies.length > 0) {
                // Visual Effect (Expanding ring particle logic required, or just bunch of particles)
                game.floatingTexts.push(new FloatingText(tower.x, tower.y - 50, '❄️ NOVA', '#00ffff'));
                game.specials.novaCD = Math.max(60, 300 - novaLvl * 5);
            }
        }
    }
}

function updateUI() {
    document.getElementById('money').textContent = game.money;
    document.getElementById('score').textContent = game.score;
    document.getElementById('wave').textContent = game.wave;
    updateStats();
    renderUpgradePanel();
}

function updateStats() {
    const statHP = document.getElementById('statHP');
    const statRegen = document.getElementById('statRegen');
    const statDMG = document.getElementById('statDamage');
    const statSPD = document.getElementById('statSpeed');
    const statRNG = document.getElementById('statRange');
    const statCRIT = document.getElementById('statCrit');
    const statMulti = document.getElementById('statMulti');
    const statTargets = document.getElementById('statTargets');

    const statCritFactor = document.getElementById('statCritDm');
    const statProx = document.getElementById('statProx');
    const statLuck = document.getElementById('statLuck');

    const statDefense = document.getElementById('statDefense');
    const statArmor = document.getElementById('statArmor');
    const statThorns = document.getElementById('statThorns');
    const statLifesteal = document.getElementById('statLifesteal');

    if (statHP) statHP.textContent = Math.ceil(tower.health) + '/' + tower.maxHealth;
    if (statRegen) statRegen.textContent = getHealthRegen().toFixed(1) + '/s';
    if (statDMG) statDMG.textContent = getTotalDamage();
    if (statSPD) statSPD.textContent = (60 / getAttackSpeed()).toFixed(1) + '/s';
    if (statRNG) statRNG.textContent = getRange();
    if (statCRIT) statCRIT.textContent = getCritChance() + '%';

    if (statCritFactor) statCritFactor.textContent = 'x' + getCritFactor().toFixed(1);

    if (statProx) {
        const val = getProximityBonus();
        statProx.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statProx.textContent = '+' + val + '%';
    }

    if (statLuck) {
        const val = getFreeUpgradeChance();
        statLuck.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statLuck.textContent = val.toFixed(1) + '%';
    }

    if (statMulti) statMulti.textContent = getMultishotChance() + '%';
    if (statTargets) statTargets.textContent = getMultishotTargets();

    // Defense Stats (Show only if unlocked/active)
    if (statDefense) {
        const val = getDefensePercent();
        statDefense.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statDefense.textContent = val + '%';
    }
    if (statArmor) {
        const val = getAbsoluteDefense();
        statArmor.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statArmor.textContent = val;
    }
    if (statThorns) {
        const val = getThornDamage();
        statThorns.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statThorns.textContent = val;
    }
    if (statLifesteal) {
        const val = getLifesteal();
        statLifesteal.parentElement.style.display = val > 0 ? 'flex' : 'none';
        statLifesteal.textContent = val + '%';
    }
}

// ============================================
// UPGRADE PANEL
// ============================================
function renderUpgradePanel() {
    const panel = document.getElementById('upgradeContent');
    if (!panel) return;

    // Clear panel only if tab changed
    if (panel.dataset.lastTab !== currentTab) {
        panel.innerHTML = '';
        panel.dataset.lastTab = currentTab;
    }

    const upgrades = upgradeDefinitions[currentTab];

    for (const key in upgrades) {
        const upg = upgrades[key];
        const btnId = `btn-${currentTab}-${key}`;
        let btn = document.getElementById(btnId);

        const currentCost = Math.round(upg.cost * Math.pow(upg.costMult, upg.level));
        const canAfford = game.money >= currentCost;
        const isMaxed = upg.level >= upg.maxLevel;
        const isLocked = upg.unlocked === false;

        // Create button if it doesn't exist
        if (!btn) {
            btn = document.createElement('button');
            btn.id = btnId;
            btn.className = 'upgrade-btn';
            // Click handler
            btn.onclick = () => {
                const u = upgradeDefinitions[currentTab][key]; // Re-fetch to be safe
                if (u.unlocked === false) unlockUpgrade(currentTab, key);
                else buyUpgrade(currentTab, key);
            };
            // Structure
            btn.innerHTML = `
                <span class="upgrade-icon"></span>
                <span class="upgrade-name"></span>
                <span class="upgrade-level"></span>
                <span class="upgrade-cost"></span>
            `;
            panel.appendChild(btn);
        }

        // Update visual state
        const iconSpan = btn.querySelector('.upgrade-icon');
        const nameSpan = btn.querySelector('.upgrade-name');
        const levelSpan = btn.querySelector('.upgrade-level');
        const costSpan = btn.querySelector('.upgrade-cost');

        iconSpan.textContent = upg.icon;
        nameSpan.textContent = upg.name;

        if (isLocked) {
            btn.className = 'upgrade-btn locked';
            btn.removeAttribute('disabled');
            levelSpan.textContent = '🔒';
            costSpan.textContent = `${upg.unlockCost}💎`;
        } else {
            const disabled = !canAfford || isMaxed;
            btn.className = `upgrade-btn ${disabled ? 'disabled' : ''}`;
            if (disabled) btn.setAttribute('disabled', 'true');
            else btn.removeAttribute('disabled');

            levelSpan.textContent = isMaxed ? `Lv.${upg.level} MAX` : `Lv.${upg.level}`;
            costSpan.textContent = isMaxed ? '-' : `${currentCost}💰`;
        }
    }
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    renderUpgradePanel();
}

function unlockUpgrade(category, key) {
    const upg = upgradeDefinitions[category][key];
    if (totalCrystals >= upg.unlockCost) {
        totalCrystals -= upg.unlockCost;
        upg.unlocked = true;
        saveProgress();
        updateCrystalsDisplay();
        renderUpgradePanel();
    }
}

function buyUpgrade(category, key) {
    const upg = upgradeDefinitions[category][key];
    const cost = Math.round(upg.cost * Math.pow(upg.costMult, upg.level));

    if (game.money >= cost && upg.level < upg.maxLevel) {
        game.money -= cost;
        upg.level++;

        // Update tower stats if needed
        if (category === 'defense' && key === 'health') {
            const oldMax = tower.maxHealth;
            tower.maxHealth = getMaxHealth();
            tower.health += (tower.maxHealth - oldMax);
            tower.updateHealthUI();
        }

        saveProgress();
        updateUI();
    }
}

// ============================================
// ULTIMATES
// ============================================
function updateUltimates() {
    for (const key in ultimates) {
        const ult = ultimates[key];
        if (ult.currentCooldown > 0) ult.currentCooldown--;
        if (ult.duration && ult.active) {
            ult.durationTimer--;
            if (ult.durationTimer <= 0) ult.active = false;
        }
    }
}

function useUltimate(key) {
    const ult = ultimates[key];
    if (!ult.unlocked || ult.currentCooldown > 0) return;

    ult.currentCooldown = ult.cooldown;

    switch (key) {
        case 'meteor':
            // Damage all enemies
            for (const enemy of enemies) {
                enemy.takeDamage(200 + game.wave * 20);
            }
            // Big explosion
            for (let i = 0; i < 50; i++) {
                game.particles.push(new Particle(
                    canvas.width / 2 + (Math.random() - 0.5) * 300,
                    canvas.height / 2 + (Math.random() - 0.5) * 300,
                    Math.random() * Math.PI * 2,
                    '#ff6600', 40
                ));
            }
            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2, '☄️ METEOR!', '#ff6600'
            ));
            break;
        case 'shield':
            ult.active = true;
            ult.durationTimer = ult.duration;
            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2, '🔮 SHIELD!', '#64c8ff'
            ));
            break;
        case 'overdrive':
            ult.active = true;
            ult.durationTimer = ult.duration;
            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2, '⚡ OVERDRIVE!', '#ffff00'
            ));
            break;
        case 'goldRush':
            ult.active = true;
            ult.durationTimer = ult.duration;
            game.floatingTexts.push(new FloatingText(
                canvas.width / 2, canvas.height / 2, '🤑 GOLD RUSH!', '#ffd700'
            ));
            break;
    }

    renderUltimates();
}

function unlockUltimate(key) {
    const ult = ultimates[key];
    if (totalCrystals >= ult.unlockCost) {
        totalCrystals -= ult.unlockCost;
        ult.unlocked = true;
        saveProgress();
        updateCrystalsDisplay();
        renderUltimates();

        game.floatingTexts.push(new FloatingText(
            canvas.width / 2, canvas.height / 2,
            '🔓 UNLOCKED!', '#00ff00'
        ));
    } else {
        game.floatingTexts.push(new FloatingText(
            canvas.width / 2, canvas.height / 2,
            'MISSING CRYSTALS! 💎', '#ff0000'
        ));
    }
}

function renderUltimates() {
    const panel = document.getElementById('ultimatePanel');
    if (!panel) return;

    let html = '';
    for (const key in ultimates) {
        const ult = ultimates[key];
        const onCooldown = ult.currentCooldown > 0;
        const cdPercent = onCooldown ? (ult.currentCooldown / ult.cooldown) * 100 : 0;

        if (!ult.unlocked) {
            html += `<button class="ult-btn locked" onclick="unlockUltimate('${key}')">
                <span class="ult-icon">🔒</span>
                <span class="ult-name">${ult.name}</span>
                <span class="ult-cost">${ult.unlockCost}💎</span>
            </button>`;
        } else {
            html += `<button class="ult-btn ${onCooldown ? 'cooldown' : 'ready'} ${ult.active ? 'active' : ''}" 
                onclick="useUltimate('${key}')" ${onCooldown ? 'disabled' : ''}>
                <span class="ult-icon">${ult.icon}</span>
                <span class="ult-name">${ult.name}</span>
                ${onCooldown ? `<span class="ult-cd">${Math.ceil(ult.currentCooldown / 60)}s</span>` : '<span class="ult-ready">READY</span>'}
                <div class="ult-cd-bar" style="width: ${cdPercent}%"></div>
            </button>`;
        }
    }
    panel.innerHTML = html;
}

// ============================================
// GAME LOOP
// ============================================
function updateGameLogic() {
    updateUltimates();
    updateSpecials();

    // Auto-Rush Logic
    if (game.rushMode) {
        // Optimized Continuous Spawning (Stacking Waves)
        // Hard Cap to prevent crash (1500 entities)
        if (game.enemiesToSpawn > 0 && enemies.length < 1500) {
            const batchSize = 50;
            const toSpawn = Math.min(game.enemiesToSpawn, batchSize);

            for (let i = 0; i < toSpawn; i++) {
                spawnEnemy();
                game.enemiesToSpawn--;
            }

            // Reward per batch
            const bonus = Math.floor(toSpawn * (5 + game.wave * 0.5));
            if (bonus > 0 && Math.random() < 0.1) {
                game.money += bonus;
                if (game.floatingTexts.length < 50) { // Text Cap
                    game.floatingTexts.push(new FloatingText(tower.x, tower.y - 60, `☠️ RUSH +${bonus}💰`, '#00ff00'));
                }
            } else if (bonus > 0) {
                game.money += bonus;
            }
        }

        // Instant Next Wave (Stacking) - No waiting for kills
        if (game.enemiesToSpawn <= 0) {
            game.waveTimer = 0;
        }
    }

    // Rush Button Visibility
    const rushBtn = document.getElementById('rushBtn');
    if (rushBtn) {
        // Always show in Auto Mode, or only when active?
        // Keep visible if running
        const visible = game.running;
        rushBtn.style.display = visible ? 'flex' : 'none';

        // Ensure state visual persists if recreated?
        // We set styles in toggle, but if button is hidden/shown... style is inline, so it persists.
    }

    if (game.enemiesToSpawn > 0) {
        game.spawnTimer--;
        if (game.spawnTimer <= 0) {
            spawnEnemy();
            game.enemiesToSpawn--;
            game.spawnTimer = game.spawnDelay;
        }
    } else {
        // Wave Spawning Finished
        // If Rush Mode, we already triggered waveTimer = 0 above.
        // If Normal Mode, wait for clean sweep (enemies.length === 0).

        if (game.rushMode || enemies.length === 0) {
            game.waveTimer--;
            if (game.waveTimer <= 0) {
                completeWave();
                game.wave++;
                startWave();
                game.waveTimer = game.waveDelay;
            }
        }
    }

    tower.update(enemies);

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        if (enemies[i].health <= 0) enemies.splice(i, 1);
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update();
        if (projectiles[i].lifetime <= 0 ||
            projectiles[i].x < -50 || projectiles[i].x > canvas.width + 50 ||
            projectiles[i].y < -50 || projectiles[i].y > canvas.height + 50) {
            projectiles.splice(i, 1);
        }
    }

    for (let i = game.particles.length - 1; i >= 0; i--) {
        game.particles[i].update();
        if (game.particles[i].lifetime <= 0) game.particles.splice(i, 1);
    }

    // Update Effects
    for (let i = game.effects.length - 1; i >= 0; i--) {
        game.effects[i].update();
        if (game.effects[i].lifetime <= 0) game.effects.splice(i, 1);
    }

    for (let i = game.floatingTexts.length - 1; i >= 0; i--) {
        game.floatingTexts[i].update();
        if (game.floatingTexts[i].lifetime <= 0) game.floatingTexts.splice(i, 1);
    }

    checkCollisions();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    for (const p of game.particles) p.draw();
    for (const e of game.effects) e.draw();
    for (const p of projectiles) p.draw();
    for (const e of enemies) e.draw();
    tower.draw();
    for (const t of game.floatingTexts) t.draw();

    // Update ultimate cooldowns display (UI only)
    if (game.running) renderUltimates();
}

function gameLoop() {
    if (!game.running) return;

    // Time banking logic...

    // Time banking for speed control
    gameTimeBank += gameSpeed;

    // ============================================
    // RUSH WAVE
    // ============================================
    // Rush Wave function removed from local scope

    // Safety cap to prevent freeze
    let updates = 0;
    const maxUpdates = 1000;
    const loopStart = performance.now();

    while (gameTimeBank >= 1 && updates < maxUpdates) {
        // Allow up to 12ms of updates (leaving ~4ms for render to maintain 60fps)
        if (performance.now() - loopStart > 12) {
            // Cap debt instead of wiping it. ALlow catch-up next frame.
            gameTimeBank = Math.min(gameTimeBank, 200);
            break;
        }
        updateGameLogic();
        gameTimeBank -= 1;
        updates++;
    }

    if (updates >= maxUpdates) gameTimeBank = 0;

    drawGame();

    requestAnimationFrame(gameLoop);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(50, 80, 100, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
}

// ============================================
// RUSH WAVE
// ============================================
// ============================================
// RUSH WAVE (TOGGLE)
// ============================================
function rushWave() {
    game.rushMode = !game.rushMode;
    const btn = document.getElementById('rushBtn');
    if (btn) {
        if (game.rushMode) {
            btn.classList.add('active');
            btn.innerHTML = '<span class="icon">☠️</span><span>AUTO RUSH</span>';
            btn.style.boxShadow = '0 0 15px #00ff00';
            btn.style.borderColor = '#00ff00';
            btn.style.color = '#00ff00';
            game.floatingTexts.push(new FloatingText(tower.x, tower.y - 80, 'AUTO RUSH ON', '#00ff00'));
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<span class="icon">☠️</span><span>RUSH</span>';
            btn.style.boxShadow = 'none';
            btn.style.borderColor = '#ff5050';
            btn.style.color = '#ff5050';
            game.floatingTexts.push(new FloatingText(tower.x, tower.y - 80, 'AUTO RUSH OFF', '#ff5050'));
        }
    }
}

// ============================================
// GAME OVER
// ============================================
function gameOver() {
    game.running = false;

    // Calculate final crystals (remainder)
    const earnedTotal = Math.floor((game.wave + game.score / 100) * getCrystalBonus());
    const newCrystals = Math.max(0, earnedTotal - (game.crystalsGivenThisGame || 0));

    if (newCrystals > 0) {
        totalCrystals += newCrystals;
        game.crystalsGivenThisGame = (game.crystalsGivenThisGame || 0) + newCrystals;
        saveProgress();
    }

    // Display total earned this game for info
    // But we only add newCrystals to totalCrystals now

    document.getElementById('finalWave').textContent = game.wave;
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('crystalsEarned').textContent = earnedTotal; // Show total earned for run
    updateCrystalsDisplay();

    currentPermTab = 'attack';
    renderPermUpgrades();

    document.getElementById('gameOver').classList.add('active');
}

// ============================================
// START GAME
// ============================================
function startGame() {
    game.running = true;
    game.money = getStartMoney();
    game.score = 0;
    game.wave = 1;
    game.enemiesKilled = 0;
    game.enemiesPerWave = 5;
    game.spawnTimer = 0;
    game.spawnDelay = 120;
    game.waveTimer = 180;
    game.crystalsGivenThisGame = 0;
    game.particles = [];
    game.floatingTexts = [];

    // Reset game speed
    gameSpeed = 1;
    speedIndex = 0;
    const speedBtn = document.getElementById('speedBtn');
    if (speedBtn) {
        speedBtn.querySelector('#speedText').textContent = '1x';
        speedBtn.style.borderColor = 'rgba(0, 255, 255, 0.5)';
        speedBtn.style.boxShadow = 'none';
    }

    // Reset in-game upgrade levels (not unlocks!)
    for (const cat in upgradeDefinitions) {
        for (const key in upgradeDefinitions[cat]) {
            upgradeDefinitions[cat][key].level = 0;
        }
    }

    // Reset ultimate cooldowns
    for (const key in ultimates) {
        ultimates[key].currentCooldown = 0;
        ultimates[key].active = false;
    }

    tower = new Tower();
    tower.updateHealthUI();

    enemies = [];
    projectiles = [];

    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOver').classList.remove('active');

    updateUI();
    updateCrystalsDisplay();
    renderUltimates();
    startWave();
    gameLoop();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Perm tab switching
document.querySelectorAll('.perm-tab').forEach(btn => {
    btn.addEventListener('click', () => switchPermTab(btn.dataset.permtab));
});

// Keyboard
document.addEventListener('keydown', (e) => {
    if (!game.running && (e.key === 'Enter' || e.key === ' ')) {
        startGame();
    }
    if (game.running) {
        if (e.key === 'q') handleUltimateInput('meteor');
        if (e.key === 'w') handleUltimateInput('shield');
        if (e.key === 'e') handleUltimateInput('overdrive');
        if (e.key === 'r') handleUltimateInput('goldRush');
    }
});

function handleUltimateInput(key) {
    if (ultimates[key].unlocked) useUltimate(key);
    else unlockUltimate(key);
}

// ============================================
// INIT
// ============================================
loadProgress();
renderUpgradePanel();
renderUltimates();
