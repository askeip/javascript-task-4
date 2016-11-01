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
    return collection;
};

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
        if (friend[this[0]] === filter) {
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
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return;
};

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
        clone[this[0]] = this[1](formattedFriend[this[0]]);
    }

    return formattedFriend;
}

function formatField(friends, params) {
    return friends.map(formatFriendsField, params);
}

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = function (count) {
    console.info(count);

    return;
};

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
