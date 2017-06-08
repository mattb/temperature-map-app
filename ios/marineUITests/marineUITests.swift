//
//  marineUITests.swift
//  marineUITests
//
//  Created by Matt Biddulph on 07/06/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import XCTest

class marineUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
      XCUIApplication().children(matching: .window).element(boundBy: 0).children(matching: .other).element.children(matching: .other)["settings"].tap()

    }
    
}
