
function isValid(str) {
    if (str.length === 0) return true;
    if (str.length % 2 !== 0) return false;
    const stack = [];
    
    const brackets = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        }
        else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0 || stack.pop() !== brackets[char]) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

console.log('"()" ->', isValid("()"));    
console.log('"()[]{}" ->', isValid("()[]{}"));
console.log('"(]" ->', isValid("(]"));     
console.log('"([)]" ->', isValid("([)]"));   
console.log('"{[]}" ->', isValid("{[]}"));  

