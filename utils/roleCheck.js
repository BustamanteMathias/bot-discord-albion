function hasRole(member, roleNameOrId) {
    return member.roles.cache.some(role => role.name === roleNameOrId || role.id === roleNameOrId);
}

module.exports = hasRole;
