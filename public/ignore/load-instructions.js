var c=new showdown.Converter({emoji:true});$.get('todo.md',function(t){$('#todo-list').html(c.makeHtml(t));});
