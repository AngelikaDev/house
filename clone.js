function deepClone(source, cache = new WeakMap()) {
    
    if (source === null || typeof source !== 'object') {
        return source;
    }

    if (cache.has(source)) {
        return cache.get(source);
    }

    if (source instanceof Date) {
        return new Date(source.getTime());
    }

    if (source instanceof RegExp) {
        return new RegExp(source.source, source.flags);
    }

    if (source instanceof Map) {
        const mapCopy = new Map();
        cache.set(source, mapCopy);
        for (const [key, value] of source) {
            mapCopy.set(deepClone(key, cache), deepClone(value, cache));
        }
        return mapCopy;
    }

    if (source instanceof Set) {
        const setCopy = new Set();
        cache.set(source, setCopy);
        for (const value of source) {
            setCopy.add(deepClone(value, cache));
        }
        return setCopy;
    }

    if (Array.isArray(source)) {
        const arrayCopy = [];
        cache.set(source, arrayCopy);
        for (let i = 0; i < source.length; i++) {
            arrayCopy[i] = deepClone(source[i], cache);
        }
        return arrayCopy;
    }

    const proto = Object.getPrototypeOf(source);
    const objCopy = Object.create(proto);
    cache.set(source, objCopy);

    const allProperties = [
        ...Object.getOwnPropertyNames(source),
        ...Object.getOwnPropertySymbols(source)
    ];

    for (const key of allProperties) {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        
        if (descriptor && descriptor.value !== undefined) {
            const valueToCopy = deepClone(descriptor.value, cache);
            Object.defineProperty(objCopy, key, {
                ...descriptor,
                value: valueToCopy
            });
        } else if (descriptor && (descriptor.get || descriptor.set)) {
            Object.defineProperty(objCopy, key, descriptor);
        }
    }

    return objCopy;
}

const original = {
    string: "Hello",
    number: 42,
    boolean: true,
    nullValue: null,
    undefinedValue: undefined,

    address: {
        city: "Moscow",
        street: "Tverskaya",
        coordinates: {
            lat: 55.7558,
            lng: 37.6176
        }
    },

    tags: ["javascript", "deep", "clone"],
    nestedArray: [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
        ["a", "b", { deep: "value" }]
    ],

    createdAt: new Date("2024-01-15T10:30:00Z"),

    userMap: new Map([
        ["name", "Angelika"],
        ["age", 22],
        ["address", { city: "Iz", zip: 10001 }]
    ]),

    uniqueIds: new Set([1, 2, 3, 4, 5]),

    pattern: /test/gi,

    greet: function(name) {
        return `Hello, ${name}!`;
    },

    [Symbol("id")]: "secret-value",

    get fullInfo() {
        return `${this.string} from ${this.address.city}`;
    }
};

original.self = original;
original.address.parent = original;

const copy = deepClone(original);
console.log(" ПРОВЕРКА ГЛУБОКОГО КОПИРОВАНИЯ\n");

console.log("1. Примитивы:");
console.log("   string:", copy.string === original.string); 
console.log("   number:", copy.number === original.number);

console.log("\n2. Вложенные объекты:");
console.log("   address === original.address:", copy.address === original.address); 
console.log("   address.coordinates === original.address.coordinates:", 
            copy.address.coordinates === original.address.coordinates); 

console.log("\n3. Массивы:");
console.log("   tags === original.tags:", copy.tags === original.tags); 
console.log("   nestedArray[2] === original.nestedArray[2]:", 
            copy.nestedArray[2] === original.nestedArray[2]); 

console.log("\n4. Date:");
console.log("   createdAt === original.createdAt:", copy.createdAt === original.createdAt);
console.log("   createdAt value:", copy.createdAt.toISOString() === original.createdAt.toISOString()); 

console.log("\n5. Map:");
console.log("   userMap === original.userMap:", copy.userMap === original.userMap); 
console.log("   userMap.get('address') === original.userMap.get('address'):", 
            copy.userMap.get("address") === original.userMap.get("address")); 

console.log("\n6. Set:");
console.log("   uniqueIds === original.uniqueIds:", copy.uniqueIds === original.uniqueIds); 
console.log("   uniqueIds size:", copy.uniqueIds.size === original.uniqueIds.size); 

console.log("\n7. Циклические ссылки:");
console.log("   self === original.self:", copy.self === original.self); 
console.log("   self.self === copy:", copy.self.self === copy); 

console.log("\n8. Функции:");
console.log("   greet === original.greet:", copy.greet === original.greet); 
console.log("   greet() result:", copy.greet("World")); 

console.log("\n9. Геттеры:");
console.log("   fullInfo:", copy.fullInfo); 

const originalSymbols = Object.getOwnPropertySymbols(original);
const copySymbols = Object.getOwnPropertySymbols(copy);
console.log("\n10. Символы:");
console.log("   Symbols count:", originalSymbols.length === copySymbols.length); 

console.log("\n11. Независимость копии:");
copy.address.city = "St. Petersburg";
copy.tags.push("modified");
copy.userMap.set("newKey", "newValue");

console.log("   original.address.city:", original.address.city); 
console.log("   original.tags:", original.tags); 
console.log("   original.userMap.has('newKey'):", original.userMap.has("newKey")); 