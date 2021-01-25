The following is a set of guidelines for contributing to reach52 Community edition and its packages, which are hosted in the reach52 organzation's GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

***Table Of Contents***

***Code of Conduct***

Please refer to the CODE_OF_CONDUCT.MD file for a detailed understanding on reach52 Community edition's code of conduct 

***What should I know before I get started?***

How Can I Contribute?

Reporting Bugs
Suggesting Enhancements
Your First Code Contribution
Pull Requests
Styleguides

Git Commit Messages
JavaScript Styleguide
CoffeeScript Styleguide
Specs Styleguide
Documentation Styleguide
Additional Notes

***Issue and Pull Request Labels***
***Code of Conduct***
This project and everyone participating in it is governed by the reach52 Community edition's Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to lakshmi@reach52.com.

Note: Please don't file an issue to ask a question. You'll get faster results by using the resources below.

What should I know before I get started?
reach52 Community edition is a HealthCare e-commerce based open source project. 
Also, because reach52 Community edition is so extensible, it's possible that a feature you've become accustomed to in reach52 Community edition or an issue you're encountering isn't coming from a bundled package at all, but rather a community package you've installed. Each community package has its own repository too.

***How Can I Contribute?***
Reporting Bugs
This section guides you through submitting a bug report for reach52 Community edition. 
Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports 🔎.

***Before creating bug reports***, please check this list (Link TBD) as you might find out that you don't need to create one. When you are creating a bug report, please include an appropriate title, steps to reproduce, and a screenshot. and as many more details as possible.

Note: If you find a Closed issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

Before Submitting A Bug Report
Check the FAQs on the forum for a list of common questions and problems.
Determine which repository the problem should be reported in.
Perform a cursory search to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

***How Do I Submit A (Good) Bug Report?***
Bugs are tracked as GitHub issues. After you've determined which repository your bug is related to, create an issue on that repository and provide the following information by filling in the template.

***Explain the problem and include additional details to help maintainers reproduce the problem:***

Use a clear and descriptive title for the issue to identify the problem.
Describe the exact steps which reproduce the problem in as many details as possible. For example, start by explaining how you started reach52 Community edition, e.g. which command exactly you used in the terminal, or how you started the app otherwise. When listing steps, don't just say what you did, but explain how you did it. For example, if you moved the cursor to the end of a line, explain if you used the mouse, or a keyboard shortcut, and if so which one?
Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use Markdown code blocks.
Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
Explain which behavior you expected to see instead and why.
Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem. If you use the keyboard while following the steps, record the GIF with the Keybinding Resolver shown. You can use this tool to record GIFs on macOS and Windows, and this tool or this tool on Linux.
If you're reporting that reach52 Community edition crashed, include a crash report with a stack trace from the operating system. On macOS, the crash report will be available in Console.app under "Diagnostic and usage information" > "User diagnostic reports". Include the crash report in the issue in a code block, a file attachment, or put it in a gist and provide link to that gist.
If the problem is related to performance or memory, include a CPU profile capture with your report.
If Chrome's developer tools pane is shown without you triggering it, that normally means that you have a syntax error in one of your themes or in your styles.less. Try running in Safe Mode and using a different theme or comment out the contents of your styles.less to see if that fixes the problem.
If the problem wasn't triggered by a specific action, describe what you were doing before the problem happened and share more information using the guidelines below.
Provide more context by answering these questions:

Can you reproduce the problem in safe mode?
Did the problem start happening recently (e.g. after updating to a new version of reach52 Community edition) or was this always a problem?
If the problem started happening recently, can you reproduce the problem in an older version of reach52 Community edition? What's the most recent version in which the problem doesn't happen? 
Can you reliably reproduce the issue? If not, provide details about how often the problem happens and under which conditions it normally happens.
If the problem is related to working with files (e.g. opening and editing files), does the problem happen for all files and projects or only some? Does the problem happen only when working with local or remote files (e.g. on network drives), with files of a specific type (e.g. only JavaScript or Python files), with large files or files with very long lines, or with files in a specific encoding? Is there anything else special about the files you are using?
Include details about your configuration and environment:

What's the name and version of the OS you're using?
Which packages do you have installed? You can get that list by running apm list --installed.
Are you using local configuration files config.cson, keymap.cson, snippets.cson, styles.less and init.coffee to customize reach52 Community edition? If so, provide the contents of those files, preferably in a code block or with a link to a gist.
Are you using reach52 Community edition with multiple monitors? If so, can you reproduce the problem when you use a single monitor?
Which keyboard layout are you using? Are you using a US layout or some other layout?
Suggesting Enhancements
This section guides you through submitting an enhancement suggestion for reach52 Community edition, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion 📝 and find related suggestions 🔎.

Before creating enhancement suggestions, please check this list as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible. Fill in the template, including the steps that you imagine you would take if the feature you're requesting existed.

Before Submitting An Enhancement Suggestion
Check the debugging guide for tips — you might discover that the enhancement is already available. Most importantly, check if you're using the latest version of reach52 Community edition and if you can get the desired behavior by changing reach52 Community edition's or packages' config settings.
Check if there's already a package which provides that enhancement.
Determine which repository the enhancement should be suggested in.
Perform a cursory search to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
How Do I Submit A (Good) Enhancement Suggestion?
Enhancement suggestions are tracked as GitHub issues. After you've determined which repository your enhancement suggestion is related to, create an issue on that repository and provide the following information:

Use a clear and descriptive title for the issue to identify the suggestion.
Provide a step-by-step description of the suggested enhancement in as many details as possible.
Provide specific examples to demonstrate the steps. Include copy/pasteable snippets which you use in those examples, as Markdown code blocks.
Describe the current behavior and explain which behavior you expected to see instead and why.
Include screenshots and animated GIFs which help you demonstrate the steps or point out the part of reach52 Community edition which the suggestion is related to. You can use this tool to record GIFs on macOS and Windows, and this tool or this tool on Linux.
Explain why this enhancement would be useful to most reach52 Community edition users and isn't something that can or should be implemented as a community package.
List some other text editors or applications where this enhancement exists.
Specify which version of reach52 Community edition you're using. 
Your First Code Contribution
Unsure where to begin contributing to reach52 Community edition? You can start by looking through these beginner and help-wanted issues:

Beginner issues - issues which should only require a few lines of code, and a test or two.
Help wanted issues - issues which should be a bit more involved than beginner issues.
Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

Maintain reach52 Community edition's quality
Fix problems that are important to users
Engage the community in working toward the best possible reach52 Community edition
Enable a sustainable system for reach52 Community edition's maintainers to review contributions
Please follow these steps to have your contribution considered by the maintainers:

Follow all instructions in the template
Follow the styleguides
After you submit your pull request, verify that all status checks are passing
What if the status checks are failing?
While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

***Styleguides***
Git Commit Messages
Use the present tense ("Add feature" not "Added feature")
Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
Limit the first line to 72 characters or less
Reference issues and pull requests liberally after the first line
When only changing documentation, include [ci skip] in the commit title
Consider starting the commit message with an applicable emoji:
🎨 :art: when improving the format/structure of the code
🐎 :racehorse: when improving performance
🚱 :non-potable_water: when plugging memory leaks
📝 :memo: when writing docs
🐧 :penguin: when fixing something on Linux
🍎 :apple: when fixing something on macOS
🏁 :checkered_flag: when fixing something on Windows
🐛 :bug: when fixing a bug
🔥 :fire: when removing code or files
💚 :green_heart: when fixing the CI build
✅ :white_check_mark: when adding tests
🔒 :lock: when dealing with security
⬆️ :arrow_up: when upgrading dependencies
⬇️ :arrow_down: when downgrading dependencies
👕 :shirt: when removing linter warnings
JavaScript Styleguide
All JavaScript code is linted with Prettier.

***Place requires in the following order:***
Built in Node Modules (such as path)
Local Modules (using relative paths)

***Place class properties in the following order:***
Class methods and properties (methods starting with static)
Instance methods and properties
Avoid platform-dependent code
CoffeeScript Styleguide
Set parameter defaults without spaces around the equal sign
clear = (count=1) -> instead of clear = (count = 1) ->
Use spaces around operators
count + 1 instead of count+1
Use spaces after commas (unless separated by newlines)
Use parentheses if it improves code clarity.
Prefer alphabetic keywords to symbolic keywords:
a is b instead of a == b
Avoid spaces inside the curly-braces of hash literals:
{a: 1, b: 2} instead of { a: 1, b: 2 }
Include a single line of whitespace between methods.
Capitalize initialisms and acronyms in names, except for the first word, which should be lower-case:
getURI instead of getUri
uriToOpen instead of URIToOpen
Use slice() to copy an array
Add an explicit return when your function ends with a for/while loop and you don't want it to return a collected array.
Use this instead of a standalone @
return this instead of return @
Place requires in the following order:
Built in Node Modules (such as path)
Local Modules (using relative paths)
Place class properties in the following order:
Class methods and properties (methods starting with a @)
Instance methods and properties
Avoid platform-dependent code
Specs Styleguide
Include thoughtfully-worded, well-structured Jasmine specs in the ./spec folder.
Treat describe as a noun or situation.
Treat it as a statement about state or how an operation changes state.
Example
describe 'a dog', ->
 it 'barks', ->
 # spec here
 describe 'when the dog is happy', ->
  it 'wags its tail', ->
  # spec here
  
Documentation Styleguide
Use Markdown.
Reference methods and classes in markdown with the custom {} notation:
Reference classes with {ClassName}
Reference instance methods with {ClassName::methodName}
Reference class methods with {ClassName.methodName}
Example
# Public: Disable the package with the given name.
#
# * `name`    The {String} name of the package to disable.
# * `options` (optional) The {Object} with disable options (default: {}):
#   * `trackTime`     A {Boolean}, `true` to track the amount of time taken.
#   * `ignoreErrors`  A {Boolean}, `true` to catch and ignore errors thrown.
# * `callback` The {Function} to call after the package has been disabled.
#
# Returns `undefined`.
disablePackage: (name, options, callback) ->
Additional Notes
Issue and Pull Request Labels
This section lists the labels we use to help us track and manage issues and pull requests.

GitHub search makes it easy to use labels for finding groups of issues or pull requests you're interested in. 

The labels are loosely grouped by their purpose, but it's not required that every issue has a label from every group or that an issue can't have more than one label from the same group.
