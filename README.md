# Chat

## Requirements

- node v16.3.0 or greater (Might work on older versions too)

## Get started

- `npm install`
- Fill needed credentials in `src/conf.ts`
- `npm start`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser. (Should open automagically)

### Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Retrospective

- The credential configuration solution is very barebones, but as we're not doing actual auth it felt like there's no point investing more time there
- Has no errorhandling whatsoever, so that should be fixed in a "real life scenario"
- App root grew suprisingly big. Some sort of state management solution could be in order.
- I wanted to try "components as folders" approach for once. I have mixed feelings about the approach since it makes vscode navigation a PITA, due to multiple files having the same name
- This is about as far as I would go with "naked" CSS. Even SCSS would be cool if continuing from here.
- Responsiviness is there, but not great
- The data would allow for so much more features... Had hard time stopping here
- Tests would be cool
