# Datastore + Nextjs

## Example repo

Complete example here: 


## Steps to reproduce

Full stps to reproduce.
Use the starter typescript example: https://github.com/vercel/next.js/tree/master/examples/with-aws-amplify-typescript 

```bash
npx create-next-app --example with-aws-amplify-typescript amplify-ds-test
```

```bash
cd amplify-ds-test 
```

```bash
amplify init
```

Use the defaults like the example:

```bash
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project amplifydstest
The following configuration will be applied:

Project information
| Name: amplifydstest
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start

? Initialize the project with the above configuration? Yes
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

? Please choose the profile you want to use default
Adding backend environment dev to AWS Amplify Console app: d234bkb1pj1ocw```

Add api like example except enable versioning

```

```bash
amplify add api
```

```bash
? Please select from one of the below mentioned services: GraphQL
? Provide API name: amplifydstest
? Choose the default authorization type for the API API key
? Enter a description for the API key: T1
? After how many days from now the API key should expire (1-365): 7
? Do you want to configure advanced settings for the GraphQL API Yes, I want to make some addi
tional changes.
? Configure additional auth types? Yes
? Choose the additional authorization types you want to configure for the API Amazon Cognito U
ser Pool
Cognito UserPool configuration
Using service: Cognito, provided by: awscloudformation
 
 The current configured provider is Amazon Cognito. 
 
 Do you want to use the default authentication and security configuration? Default configurati
on
 Warning: you will not be able to edit these selections. 
 How do you want users to be able to sign in? Email
 Do you want to configure advanced settings? No, I am done.
Successfully added auth resource amplifydstest382bd9a0 locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

? Enable conflict detection? Yes
? Select the default resolution strategy Auto Merge
? Do you have an annotated GraphQL schema? No
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description
)

The following types do not have '@auth' enabled. Consider using @auth with @model
         - Todo
Learn more about @auth here: https://docs.amplify.aws/cli/graphql-transformer/auth


GraphQL schema compiled successfully.

Edit your schema at /Users/colinbarrett-fox/Projects/amplify-ds-test/amplify/backend/api/amplifydstest/schema.graphql 
```

Update the schema like in the example:

```graphql
# REPLACE THIS:
# type Todo @model {
#   id: ID!
#   name: String!
#   description: String
# }
# WITH THIS:
type Todo
  @model
  @auth(
    rules: [
      { allow: owner } # Allow the creator of a todo to perform Create, Update, Delete operations.
      { allow: public, operations: [read] } # Allow public (guest users without an account) to Read todos.
      { allow: private, operations: [read] } # Allow private (other signed in users) to Read todos.
    ]
  ) {
  id: ID!
  name: String!
  description: String
}
```

```bash
amplify push
```

```bash
✔ Successfully pulled backend environment dev from the cloud.

    Current Environment: dev
    
┌──────────┬───────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name         │ Operation │ Provider plugin   │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Auth     │ amplifydstest382bd9a0 │ Create    │ awscloudformation │
├──────────┼───────────────────────┼───────────┼───────────────────┤
│ Api      │ amplifydstest         │ Create    │ awscloudformation │
└──────────┴───────────────────────┴───────────┴───────────────────┘
? Are you sure you want to continue? Yes

GraphQL schema compiled successfully.

Edit your schema at /Users/colinbarrett-fox/Projects/amplify-ds-test/amplify/backend/api/amplifydstest/schema.graphql or place .graphql files in a directory at /Users/colinbarrett-fox/Projects/amplify-ds-test/amplify/backend/api/amplifydstest/schema
? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target typescript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*
.ts
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subs
criptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
? Enter the file name for the generated code src/API.ts
```

Check for updates:

```bash
npx npm-check-updates -i '/@?aws-amplify/' && npm update
```

```bash
[====================] 2/2 100%
✔ Do you want to upgrade: @aws-amplify/ui-react ^1.0.7 → ^1.2.15? … yes
✔ Do you want to upgrade: aws-amplify ^3.3.27 → ^4.2.9? … yes

 @aws-amplify/ui-react   ^1.0.7  →  ^1.2.15     
 aws-amplify            ^3.3.27  →   ^4.2.9
 ```

Enable admin panel
Generate some seed data
Add a user via admin panel
Make some todos from the web page
Attempt to dele from webpage

Add to webbrowser console:

```bash
window.LOG_LEVEL = 'DEBUG';
```
