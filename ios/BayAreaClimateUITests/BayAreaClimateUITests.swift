//
//  BayAreaClimateUITests.swift
//  BayAreaClimateUITests
//
//  Created by Matt Biddulph on 25/01/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class BayAreaClimateUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.

        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()


        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }

    func testExample() {
      let app = XCUIApplication()
      snapshot("0Launch")
      app.otherElements["map"].tap()
      snapshot("1Temps")
      app.otherElements["status"].tap()
      app.buttons["Bay Area"].tap()
      Thread.sleep(forTimeInterval:1)
      snapshot("2BayArea")
    }
    
}
