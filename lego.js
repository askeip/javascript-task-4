'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var FUNC_PRIORITIES = {
    filterIn: 0,
    sortBy: 1,
    select: 2,
    format: 3,
    limit: 3
};

function sortQueries(query1, query2) {
    return FUNC_PRIORITIES[query1.name] - FUNC_PRIORITIES[query2.name];
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var queries = [].slice.call(arguments, 1);
    var friends = collection.slice(0);
    queries.sort(sortQueries);

    return queries.reduce(function (prevResult, query) {
        return query(prevResult);
    }, friends);
};

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
            params.forEach(function (param) {
                if (friend.hasOwnProperty(param)) {
                    mappedFriend[param] = friend[param];
                }
            });

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
            if (values.some(function (filter) {
                return friend[property] === filter;
            })) {
                return friend;
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
            if (friend1[property] < friend2[property]) {
                return -1 * comparer;
            } else if (friend1[property] > friend2[property]) {
                return comparer;
            }

            return 0;
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
    return Object.keys(obj).reduce(function (copy, property) {
        copy[property] = obj[property];

        return copy;
    }, {});
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
