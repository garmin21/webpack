import { name, sex, age } from './2';
import sum from './1';


/* less */
import '../less/index.less';
/* css */
import '../css/iconfont.css';

const promise = new Promise((res, rej) => {
  setTimeout(() => {
    res(111);
    console.log('i love you ');
  }, 2000);
});


console.log(sum(1, 2));
console.log(name, age, sex);
