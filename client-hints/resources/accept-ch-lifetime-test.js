const echo = "/client-hints/echo_client_hints_received.py";
const accept = "/client-hints/resources/accept_ch_lifetime.html";
const httpequiv_accept = "/client-hints/resources/http_equiv_accept_ch_lifetime.html";
const expect = "/client-hints/resources/expect_client_hints_headers.html"
const do_not_expect = "/client-hints/resources/do_not_expect_client_hints_headers.html"

const host_info = get_host_info();
const run_test = test => {
  // This test fetches resources/accept_ch_lifetime.html. The response headers to
  // that webpage contain Accept-CH and Accept-CH-Lifetime headers.
  // Fetching that webpage should cause the user-agent to persist origin
  // preferences for the client hints specified in Accept-CH header for a
  // duration specified in the Accept-CH-Lifetime header.

  // Next, to verify if the origin preferences were persisted by the user
  // agent, this test fetches resources/expect_client_hints_headers.html
  // in a new window. Fetching of resources/expect_client_hints_headers.html
  // verifies that the user agent actually sends the client hints in the request
  // headers.

  // Test is marked as tentative until https://github.com/whatwg/fetch/issues/726
  // is resolved.

  // First, verify the initial state to make sure that the browser does not have
  // client hints preferences cached from a previous run of the test.
  promise_test(t => {
    return fetch(test.initial_url).then(r => {
      assert_equals(r.status, 200)
      // Verify that the browser did not include client hints in the request
      // headers when fetching echo_client_hints_received.py.
      assert_false(r.headers.has("device-memory-received"), "device-memory-received");
    });
  }, test.name + " precondition: Test that the browser does not have client hints preferences cached");

  // Then, set Accept-CH-Lifetime for 1 second
  promise_test(t => {
    return new Promise(resolve => {
      if (test.type == "navigation") {
        const win = window.open(test.accept_url);
        assert_not_equals(win, null, "Popup windows not allowed?");
        addEventListener('message', t.step_func(() => {
          win.close();
          resolve();
        }), false);
      } else if (test.type == "iframe") {
        const iframe = document.createElement("iframe");
        iframe.addEventListener('load', t.step_func(() => {
          resolve();
        }), false);
        iframe.src = test.accept_url;
        document.body.appendChild(iframe);
      } else if (test.type == "subresource") {
        fetch(test.accept_url).then(r => {
          assert_equals(r.status, 200, "subresource response status")
          // Verify that the browser did not include client hints in the request
          // headers.
          assert_false(r.headers.has("device-memory-received"), "device-memory-received", "subresource request had no client hints");
          resolve();
        });
      } else {
        assert_unreached("unknown test type");
      }
    });
  }, test.name + " set Accept-CH-Lifetime");

  // Finally, verify that CH are actually sent on requests
  promise_test(t => {
    return new Promise(resolve => {
      let win;
      window.addEventListener('message', t.step_func(function(e) {
        win.close();
        assert_equals(e.data, "PASS", "message from opened page");
        t.step_timeout(resolve, 1500);
      }));
      // Open a new window. Verify that the user agent attaches the client hints.
      win = window.open(test.expect_url);
      assert_not_equals(win, null, "Popup windows not allowed?");
    });
  }, test.name + " got client hints according to expectations.");
};

