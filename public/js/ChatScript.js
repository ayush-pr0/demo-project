$(function () {
    let INDEX = 0;
    let data = {};
    const chats = JSON.parse(localStorage.getItem("chats")) || [
        {
            msg: "Hey! I'm HealthGPT. How can I assist you?",
            type: "bot",
        },
    ];
    chats.forEach((ele) => {
        generate_message(ele.msg, ele.type);
    });
    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val().trim();
        if (msg == "") {
            return false;
        }
        generate_message(msg, "user");
        chats.push({ msg, type: "user" });
        localStorage.setItem("chats", JSON.stringify(chats));
        document.querySelector("#chat-input").disabled = true;
        generate_typing();

        const inputData = { prompt: msg };

        fetch("/healthgpt", {
            method: "POST",
            body: JSON.stringify(inputData),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                generate_message(data.msg, "bot");
                chats.push({ msg: data.msg, type: "bot" });
                localStorage.setItem("chats", JSON.stringify(chats));
                document.querySelector("#chat-input").disabled = false;
                // handle the response data here
            })
            .catch((error) => {
                console.log(error);
            });
    });

    function generate_message(msg, type) {
        if (type == "bot") $("#cm-msg-loading").remove();
        else INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + '">';
        str += '          <div class="cm-msg-text">';
        str += msg;
        str += "          </div>";
        str += "        </div>";
        const data = { msg, type };
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX)
            .hide()
            .fadeIn(300);
        if (type == "user") {
            $("#chat-input").val("");
        }
        $(".chat-logs")
            .stop()
            .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }

    function generate_typing() {
        INDEX++;
        var str = "";
        str +=
            "<div id='cm-msg-loading" +
            "' class=\"chat-msg " +
            "bot loading" +
            '">';
        str += '          <div class="cm-msg-text loader">';
        str += "            <span></span>";
        str += "            <span></span>";
        str += "            <span></span>";
        str += "          </div>";
        str += "        </div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX)
            .hide()
            .fadeIn(80);
        $(".chat-logs")
            .stop()
            .animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 100);
    }

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle("scale");
        $(".chat-box").toggle("scale");
    });

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle("scale");
        $(".chat-box").toggle("scale");
    });

    $(".chat-box-delete").click(function () {
        localStorage.clear("chats");
        chats.length = 1;
        $(".chat-msg").remove();
        generate_message(chats[0].msg, chats[0].type);
    });
});
