
# Automation API Generator

This project has created to relieve work load as SDET or Automation Test Engineer. In moderation, automation API code able to write with only run the script and generate from Postman collection. You just export the collection, and run the Generator to write the automation code.

## Objectives

1. Generate Postman collection with JSON format into Mocha-Chai template scripts
2. Applying DDT (data-driven test) mechanism to request API with a lot of datas in body request
3. Applying POM (page-object model) mechanism to request the API so it can be reused to another test file
4. Have default verification for status code and json-schema
5. Create scripts that easy to maintain

## List of Contents:
- [Prerequisite](prerequisite.md)
- [Installation](installation.md)
- [Lifecycle of Mocha Framework](lifecycle.md)
- [Folder Structure and Usage](folder.md)
  - [/runner](folder.md#runner)
  - [/tests/data](folder.md#testsdata)
  - [/tests/helper](folder.md#testshelper)
  - [/tests/pages](folder.md#testspages)
  - [/tests/scenarios](folder.md#scenarios.md)
  - [/tests/schema](folder.md#testsschema)
- [Scenarios](scenarios.md)
  - [Default templates](scenarios.md#default-templates)
  - [Default templates with body request](scenarios.md#default-templates-with-body-request)
- [Pages](pages.md)
  - [Default templates](pages.md#default-templates)
- [Implementation](implementation.md)
- [Best Practices](practice.md)
- [Common Error](error.md)