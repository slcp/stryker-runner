As a user of mutation testing, StrykerJS and Stryker Runner
I want to be able to discover surviving mutants in the text editor
So that the feedback loop to kill the mutant is as short as possible.

## Least effort?

  - Is the least effort here a CodeLens provider that annotates the code and opens the/a (html) report for that page/line/mutant

## Implement some visual indicator that there are surviving mutants in a source file

  - CodeLens
    - This provides the ability to annotate the line with a text button than can trigger a command
    - Not sure we can open a popup or anything like that from this artifact
    - Keep an eye out for any missed functionality
  - Decorations
    - Gutters
      - Displaying an icon in the gutter of the line (like test coverage extension).
      - This could be a nice indicator, potentially using the Stryker logo (svg is probably desirable).
        - Maybe the logo with the number of surviving mutants in it?
      - Explore usage in conjunction with hover?
  - Hover
    - Can display a popup when the user hovers over some text - this is different from code completion, signature stuff.
        - But would it interfere with code completion, signature stuff?
    - This kind of popup is what I had in mind originally, listing each surviving mutation.
    - Explore usage of this in conjunction with decorations?

### Further questions

  - The gutter feels like a good indicator but is some visual feedback on the line itself to indicate where the mutants are desirable?
    - Otherwise how would a user understand that hovering provides more information? And where should they hover?
    - Given that there are plenty of extensions (as well as core VSCode) trying to show feedback to the user if trying to show more going to be too much?