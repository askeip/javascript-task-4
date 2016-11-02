'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var args = [].slice.call(arguments).slice(1);
    var coll = [].slice.call(collection);
    args.sort(sortQueries);
    for (var arg in args) {
        if (args.hasOwnProperty(arg)) {
            coll = args[arg].func(coll, args[arg].params);
        }
    }

    return coll;
};

var funcPriorities = {
    sortFriends: 1,
    filterFriends: 1,
    selectFields: 2,
    formatField: 3,
    limitFriends: 3
};
function sortQueries(query1, query2) {
    if (funcPriorities[query1.func.name] < funcPriorities[query2.func.name]) {
        return -1;
    }
    if (funcPriorities[query1.func.name] > funcPriorities[query2.func.name]) {
        return 1;
    }

    return 0;
}

function convertForQuery(func, params) {
    return { func: func,
    params: params };
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {
    return convertForQuery(selectFields, [].slice.call(arguments));
};

/**
 * @this mapFriends
 * @param {Object} friend
 * @returns {Object}
 */
function mapFriends(friend) {
    var mappedFriend = {};
    for (var param in this) {
        if (this.hasOwnProperty(param) && friend.hasOwnProperty(this[param])) {
            mappedFriend[this[param]] = friend[this[param]];
        }
    }

    return mappedFriend;
}

function selectFields(friends, params) {
    return friends.map(mapFriends, params);
}

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Object}
 */
exports.filterIn = function (property, values) {
    return convertForQuery(filterFriends, [property, values]);
};

/**
 * @this formatFriendsField
 * @param {Object} friend
 * @returns {Object}
 */
function filterInFilter(friend) {
    for (var filter in this[1]) {
        if (friend[this[0]] === this[1][filter]) {
            return friend;
        }
    }
}

function filterFriends(friends, params) {
    return friends.filter(filterInFilter, params);
}

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Object}
 */
exports.sortBy = function (property, order) {
    if (order === 'asc') {
        return convertForQuery(sortFriends, [property, sortAscComparer]);
    } else if (order === 'desc') {
        return convertForQuery(sortFriends, [property, sortDescComparer]);
    }

};

var sortParam;
function sortFriends(friends, params) {
    sortParam = params[0];
    friends.sort(params[1]);

    return friends;
}

function sortAscComparer(friend1, friend2) {
    if (friend1[sortParam] < friend2[sortParam]) {
        return -1;
    }
    if (friend1[sortParam] > friend2[sortParam]) {
        return 1;
    }

    return 0;
}

function sortDescComparer(friend1, friend2) {
    return sortAscComparer(friend2, friend1);
}

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Object}
 */
exports.format = function (property, formatter) {
    return convertForQuery(formatField, [property, formatter]);
};

function clone(obj) {
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }

    return copy;
}

/**
 * @this formatFriendsField
 * @param {Object} friend
 * @returns {Object}
 */
function formatFriendsField(friend) {
    var formattedFriend = clone(friend);
    if (formattedFriend.hasOwnProperty(this[0])) {
        formattedFriend[this[0]] = this[1](formattedFriend[this[0]]);
    }

    return formattedFriend;
}

function formatField(friends, params) {
    return friends.map(formatFriendsField, params);
}

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Object}
 */
exports.limit = function (count) {
    return convertForQuery(limitFriends, [count]);
};

function limitFriends(friends, count) {
    return friends.slice(0, count);
}

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
