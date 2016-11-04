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
    var queries = [].slice.call(arguments).slice(1);
    var friends = [].slice.call(collection);
    queries.sort(sortQueries);
    for (var query in queries) {
        if (queries.hasOwnProperty(query)) {
            friends = queries[query](friends);
        }
    }

    return friends;
};

var FUNC_PRIORITIES = {
    sortBy: 1,
    filterIn: 1,
    select: 2,
    format: 3,
    limit: 3
};
function sortQueries(query1, query2) {
    if (FUNC_PRIORITIES[query1.name] < FUNC_PRIORITIES[query2.name]) {
        return -1;
    }
    if (FUNC_PRIORITIES[query1.name] > FUNC_PRIORITIES[query2.name]) {
        return 1;
    }

    return 0;
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {
    var params = [].slice.call(arguments);

    return function select(friends) {
        return friends.map(function (friend) {
            var mappedFriend = {};
            for (var param in params) {
                if (params.hasOwnProperty(param) && friend.hasOwnProperty(params[param])) {
                    mappedFriend[params[param]] = friend[params[param]];
                }
            }

            return mappedFriend;
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Object}
 */
exports.filterIn = function (property, values) {
    return function filterIn(friends) {
        return friends.filter(function (friend) {
            for (var filter in values) {
                if (friend[property] === values[filter]) {
                    return friend;
                }
            }

            return false;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Object}
 */
exports.sortBy = function (property, order) {
    return function sortBy(friends) {
        var comparer = order === 'asc' ? 1 : -1;

        return friends.sort(function (friend1, friend2) {
            return (friend1[property] - friend2[property]) * comparer;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Object}
 */
exports.format = function (property, formatter) {
    return function format(friends) {
        return friends.map(function (friend) {
            var formattedFriend = clone(friend);
            if (formattedFriend.hasOwnProperty(property)) {
                formattedFriend[property] = formatter(formattedFriend[property]);
            }

            return formattedFriend;
        });
    };
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
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Object}
 */
exports.limit = function (count) {
    return function limit(friends) {
        return friends.slice(0, count);
    };
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
