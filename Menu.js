function testValidation() {

  const workbook = Workbook.read();

  Logger.log(JSON.stringify(workbook.settings.resources, null, 2));

}

function testAllocation() {

  const workbook =
    Workbook.read();

  Validator.run(workbook);

  const result =
    Allocator.allocate(workbook);

  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}